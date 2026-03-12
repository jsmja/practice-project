import { Download } from 'lucide-react';

interface IExcelDownloadButtonProps {
  onClick?: () => void;
}

export function ExcelDownloadButton({ onClick }: IExcelDownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
    >
      <Download size={14} />
      엑셀 다운로드
    </button>
  );
}
