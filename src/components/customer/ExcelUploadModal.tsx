import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, Upload, FileDown, FileSpreadsheet, CheckCircle2, AlertTriangle } from 'lucide-react';
import { parseCsvText, mapRowsToCustomers, generateTemplateCsv, downloadCsvFile } from '@/lib/csv-parser';
import { useUploadCustomers } from '@/hooks/client/customers/useUploadCustomers';
import type { IUploadResult, UploadStepType } from '@/models/type/excel-upload';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const PREVIEW_ROW_LIMIT = 10;

interface IExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingCustomerCount: number;
}

export function ExcelUploadModal({ isOpen, onClose, existingCustomerCount }: IExcelUploadModalProps) {
  const [step, setStep] = useState<UploadStepType>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<IUploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedCount, setUploadedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadCustomers } = useUploadCustomers();

  const resetState = useCallback(() => {
    setStep('idle');
    setFile(null);
    setUploadResult(null);
    setDragActive(false);
    setErrorMessage('');
    setUploadedCount(0);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const processFile = useCallback((selectedFile: File) => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      setErrorMessage('파일 크기가 5MB를 초과합니다.');
      setStep('error');
      return;
    }

    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'csv') {
      setErrorMessage('현재 CSV 형식만 지원됩니다. 템플릿을 다운로드하여 CSV로 저장해 주세요.');
      setStep('error');
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCsvText(text);

      if (parsed.length < 2) {
        setErrorMessage('데이터가 없습니다. 헤더와 최소 1행의 데이터가 필요합니다.');
        setStep('error');
        return;
      }

      const [headers, ...rows] = parsed;
      const result = mapRowsToCustomers(headers, rows, existingCustomerCount);
      setUploadResult(result);
      setStep('preview');
    };
    reader.onerror = () => {
      setErrorMessage('파일을 읽는 중 오류가 발생했습니다.');
      setStep('error');
    };
    reader.readAsText(selectedFile, 'UTF-8');
  }, [existingCustomerCount]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  }, [processFile]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFile]);

  const handleUpload = useCallback(async () => {
    if (!uploadResult || uploadResult.validRows.length === 0) return;

    setStep('uploading');
    try {
      await uploadCustomers(uploadResult.validRows);
      setUploadedCount(uploadResult.validRows.length);
      setStep('complete');
    } catch {
      setErrorMessage('업로드 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setStep('error');
    }
  }, [uploadResult, uploadCustomers]);

  const handleTemplateDownload = useCallback(() => {
    downloadCsvFile(generateTemplateCsv(), '고객_업로드_템플릿.csv');
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="flex max-h-[80vh] w-[720px] flex-col rounded-2xl border border-border/60 bg-white shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2">
                <FileSpreadsheet size={18} className="text-indigo-500" />
              </div>
              <h2 className="text-base font-semibold text-foreground">고객 엑셀 업로드</h2>
            </div>
            <button onClick={handleClose} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {step === 'idle' && (
              <IdleStep
                dragActive={dragActive}
                fileInputRef={fileInputRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onFileInputChange={handleFileInputChange}
                onTemplateDownload={handleTemplateDownload}
              />
            )}

            {step === 'preview' && uploadResult && (
              <PreviewStep
                file={file}
                uploadResult={uploadResult}
                onBack={() => { setStep('idle'); setFile(null); setUploadResult(null); }}
                onUpload={handleUpload}
              />
            )}

            {step === 'uploading' && <UploadingStep />}

            {step === 'complete' && (
              <CompleteStep count={uploadedCount} onClose={handleClose} />
            )}

            {step === 'error' && (
              <ErrorStep message={errorMessage} onRetry={resetState} onClose={handleClose} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ━━━ Sub-components ━━━ */

function IdleStep({
  dragActive,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInputChange,
  onTemplateDownload,
}: {
  dragActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTemplateDownload: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Info alert */}
      <div className="rounded-xl border-l-4 border-l-blue-500 bg-blue-50 px-5 py-3.5">
        <p className="text-sm font-medium text-blue-800">업로드 형식 안내</p>
        <p className="mt-1 text-xs text-blue-600">
          CSV 파일을 업로드해 주세요. 아래 컬럼 순서를 맞춰야 합니다.
        </p>
        <p className="mt-1.5 text-xs font-medium text-blue-700">
          이름(필수), 휴대폰 번호, 마케팅 수신동의, 브라우저 ID, 고객 식별 번호, 최근 접속 시간
        </p>
        <button
          onClick={onTemplateDownload}
          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
        >
          <FileDown size={14} />
          템플릿 다운로드 (.csv)
        </button>
      </div>

      {/* Drag & drop zone */}
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 transition-colors',
          dragActive
            ? 'border-indigo-400 bg-indigo-50/30'
            : 'border-border/60 bg-muted/10 hover:border-border',
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="rounded-xl bg-indigo-50 p-3">
          <Upload size={24} className="text-indigo-500" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">
          파일을 여기에 드래그하거나
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
        >
          파일 선택
        </button>
        <p className="mt-3 text-xs text-muted-foreground">
          지원 형식: CSV (최대 5MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={onFileInputChange}
        />
      </div>
    </div>
  );
}

function PreviewStep({
  file,
  uploadResult,
  onBack,
  onUpload,
}: {
  file: File | null;
  uploadResult: IUploadResult;
  onBack: () => void;
  onUpload: () => void;
}) {
  const { validRows, errors, totalRows } = uploadResult;
  const previewRows = validRows.slice(0, PREVIEW_ROW_LIMIT);
  const hasMore = validRows.length > PREVIEW_ROW_LIMIT;

  return (
    <div className="flex flex-col gap-5">
      {/* File info & summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSpreadsheet size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{file?.name}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          총 <span className="font-semibold text-foreground">{totalRows}</span>건 중{' '}
          <span className="font-semibold text-emerald-600">{validRows.length}</span>건 업로드 가능
        </p>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            <p className="text-sm font-medium text-red-800">
              {errors.length}건의 오류가 발견되었습니다
            </p>
          </div>
          <ul className="mt-2 space-y-1">
            {errors.slice(0, 5).map((err, idx) => (
              <li key={idx} className="text-xs text-red-600">
                {err.row}행 [{err.field}]: {err.message}
              </li>
            ))}
            {errors.length > 5 && (
              <li className="text-xs text-red-500">외 {errors.length - 5}건...</li>
            )}
          </ul>
        </div>
      )}

      {/* Preview table */}
      {validRows.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border/60">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">No.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">이름</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">휴대폰 번호</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">마케팅 수신동의</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">고객 식별 번호</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{row.no}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                    <td className="px-4 py-3 text-foreground">{row.phone}</td>
                    <td className="px-4 py-3 text-foreground">{row.marketingConsent}</td>
                    <td className="max-w-[180px] truncate px-4 py-3 text-xs text-muted-foreground">
                      {row.customerId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {hasMore && (
            <div className="border-t border-border/50 bg-muted/10 px-4 py-2 text-center text-xs text-muted-foreground">
              외 {validRows.length - PREVIEW_ROW_LIMIT}건 더 있음
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={onBack}
          className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          뒤로
        </button>
        <button
          onClick={onUpload}
          disabled={validRows.length === 0}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors',
            validRows.length > 0
              ? 'bg-indigo-500 hover:bg-indigo-600'
              : 'cursor-not-allowed bg-gray-300',
          )}
        >
          업로드 ({validRows.length}건)
        </button>
      </div>
    </div>
  );
}

function UploadingStep() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-500" />
      <p className="mt-4 text-sm font-medium text-foreground">업로드 중...</p>
      <p className="mt-1 text-xs text-muted-foreground">잠시만 기다려 주세요.</p>
    </div>
  );
}

function CompleteStep({ count, onClose }: { count: number; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="rounded-xl bg-green-50 p-3">
        <CheckCircle2 size={32} className="text-green-500" />
      </div>
      <p className="mt-4 text-sm font-semibold text-foreground">업로드 완료</p>
      <p className="mt-1 text-sm text-muted-foreground">
        총 <span className="font-semibold text-emerald-600">{count}건</span>의 고객 데이터가 추가되었습니다.
      </p>
      <button
        onClick={onClose}
        className="mt-6 rounded-lg bg-indigo-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
      >
        확인
      </button>
    </div>
  );
}

function ErrorStep({
  message,
  onRetry,
  onClose,
}: {
  message: string;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="rounded-xl bg-red-50 p-3">
        <AlertTriangle size={32} className="text-red-500" />
      </div>
      <p className="mt-4 text-sm font-semibold text-foreground">업로드 실패</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onClose}
          className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          닫기
        </button>
        <button
          onClick={onRetry}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
