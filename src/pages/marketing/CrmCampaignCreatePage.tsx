import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/lib/utils';
import { MessageSquare, Users, FileText, Send, Check, Upload, UserPlus, List } from 'lucide-react';

const STEPS = [
  { id: 1, label: '발송 유형 선택', icon: <MessageSquare size={16} /> },
  { id: 2, label: '수신 대상 설정', icon: <Users size={16} /> },
  { id: 3, label: '메시지 내용 작성', icon: <FileText size={16} /> },
  { id: 4, label: '발송 설정', icon: <Send size={16} /> },
];

const MESSAGE_TYPES = [
  {
    id: 'alimtalk',
    name: '알림톡',
    description: '주문/배송 등 정보성 메시지 발송',
    details: '카카오가 검수 완료한 템플릿만 사용 가능',
    cost: '1건당 SMS 충전 수 0.7건 차감',
    color: 'border-yellow-400 bg-yellow-50',
  },
  {
    id: 'friendtalk',
    name: '친구톡',
    description: '광고/마케팅 메시지 발송',
    details: '채널 친구에게만 발송 가능',
    cost: '텍스트형 1.9건, 이미지형 2.2건 차감',
    color: 'border-blue-400 bg-blue-50',
  },
  {
    id: 'brand',
    name: '브랜드 메시지',
    description: '비즈니스 인증 채널 전용 메시지',
    details: '채널 친구가 아닌 회원에게도 발송 가능',
    cost: '1건당 SMS 1.4건, 비친구 1.6건 차감',
    color: 'border-purple-400 bg-purple-50',
  },
];

const TEMPLATES = [
  { id: 1, name: '주문 확인 알림', category: '주문', preview: '#{고객명}님, 주문이 확인되었습니다.\n주문번호: #{주문번호}' },
  { id: 2, name: '배송 시작 알림', category: '배송', preview: '#{고객명}님, 상품이 배송 시작되었습니다.\n운송장번호: #{운송장}' },
  { id: 3, name: '할인 쿠폰 안내', category: '프로모션', preview: '#{고객명}님을 위한 특별 할인!\n쿠폰코드: #{쿠폰코드}' },
];

export function CrmCampaignCreatePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [targetMethod, setTargetMethod] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [sendOption, setSendOption] = useState<'now' | 'reserved'>('now');

  return (
    <div>
      <PageHeader title="CRM 캠페인 만들기" />

      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-center gap-1">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => {
                if (step.id < currentStep) {
                  setCurrentStep(step.id);
                }
              }}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                currentStep === step.id
                  ? 'bg-primary text-primary-foreground'
                  : currentStep > step.id
                    ? 'bg-green-100 text-green-700'
                    : 'bg-muted text-muted-foreground'
              )}
            >
              {currentStep > step.id ? <Check size={14} /> : step.icon}
              {step.label}
            </button>
            {idx < STEPS.length - 1 && (
              <div className={cn('mx-2 h-px w-8', currentStep > step.id ? 'bg-green-300' : 'bg-border')} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mx-auto max-w-3xl">
        {/* Step 1: 발송 유형 선택 */}
        {currentStep === 1 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">발송 유형을 선택해주세요</h2>
            <div className="grid grid-cols-3 gap-4">
              {MESSAGE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    'rounded-xl border-2 p-5 text-left transition-all',
                    selectedType === type.id ? type.color : 'border-border bg-white hover:border-gray-300'
                  )}
                >
                  <h3 className="mb-2 text-base font-bold">{type.name}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{type.description}</p>
                  <p className="text-xs text-muted-foreground">{type.details}</p>
                  <p className="mt-2 text-xs font-medium text-foreground">{type.cost}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: 수신 대상 설정 */}
        {currentStep === 2 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">수신 대상을 설정해주세요</h2>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setTargetMethod('customer-list')}
                className={cn(
                  'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all',
                  targetMethod === 'customer-list' ? 'border-primary bg-gray-50' : 'border-border hover:border-gray-300'
                )}
              >
                <List size={32} className="text-primary" />
                <span className="text-sm font-medium">고객 리스트에서 선택</span>
                <span className="text-xs text-muted-foreground">기존 고객 데이터에서 대상 선택</span>
              </button>
              <button
                onClick={() => setTargetMethod('direct-input')}
                className={cn(
                  'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all',
                  targetMethod === 'direct-input' ? 'border-primary bg-gray-50' : 'border-border hover:border-gray-300'
                )}
              >
                <UserPlus size={32} className="text-primary" />
                <span className="text-sm font-medium">전화번호 직접 입력</span>
                <span className="text-xs text-muted-foreground">수신자 번호를 직접 입력</span>
              </button>
              <button
                onClick={() => setTargetMethod('file-upload')}
                className={cn(
                  'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all',
                  targetMethod === 'file-upload' ? 'border-primary bg-gray-50' : 'border-border hover:border-gray-300'
                )}
              >
                <Upload size={32} className="text-primary" />
                <span className="text-sm font-medium">파일 업로드</span>
                <span className="text-xs text-muted-foreground">엑셀/CSV 파일로 대량 등록</span>
              </button>
            </div>

            {targetMethod === 'direct-input' && (
              <div className="mt-6 rounded-xl border border-border bg-white p-5">
                <p className="mb-2 text-sm text-muted-foreground">전화번호를 입력해주세요 (쉼표 또는 줄바꿈으로 구분)</p>
                <textarea
                  rows={5}
                  placeholder="01012345678, 01098765432..."
                  className="w-full rounded-lg border border-border p-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            {targetMethod === 'file-upload' && (
              <div className="mt-6 rounded-xl border-2 border-dashed border-border bg-white p-10 text-center">
                <Upload size={40} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">엑셀 또는 CSV 파일을 드래그하거나 클릭하여 업로드하세요</p>
                <button className="mt-3 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">
                  파일 선택
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: 메시지 내용 작성 */}
        {currentStep === 3 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">메시지 내용을 작성해주세요</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Template list */}
              <div>
                <p className="mb-3 text-sm font-medium">템플릿 선택</p>
                <div className="space-y-3">
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={cn(
                        'w-full rounded-xl border-2 p-4 text-left transition-all',
                        selectedTemplate === template.id ? 'border-primary bg-gray-50' : 'border-border hover:border-gray-300'
                      )}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-medium">{template.name}</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{template.category}</span>
                      </div>
                      <p className="whitespace-pre-line text-xs text-muted-foreground">{template.preview}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div>
                <p className="mb-3 text-sm font-medium">미리보기</p>
                <div className="rounded-xl border border-border bg-yellow-50 p-5">
                  <div className="mx-auto w-[240px] rounded-2xl bg-white p-4 shadow-md">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-yellow-300" />
                      <span className="text-xs font-medium">카카오톡 채널</span>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      {selectedTemplate ? (
                        <p className="whitespace-pre-line text-xs">
                          {TEMPLATES.find((t) => t.id === selectedTemplate)?.preview}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">템플릿을 선택하면 미리보기가 표시됩니다.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: 발송 설정 */}
        {currentStep === 4 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">발송 설정</h2>
            <div className="space-y-4">
              <button
                onClick={() => setSendOption('now')}
                className={cn(
                  'flex w-full items-center gap-4 rounded-xl border-2 p-5 text-left transition-all',
                  sendOption === 'now' ? 'border-primary bg-gray-50' : 'border-border hover:border-gray-300'
                )}
              >
                <Send size={24} className="text-primary" />
                <div>
                  <p className="font-medium">즉시 발송</p>
                  <p className="text-sm text-muted-foreground">지금 바로 메시지를 발송합니다</p>
                </div>
              </button>
              <button
                onClick={() => setSendOption('reserved')}
                className={cn(
                  'flex w-full items-center gap-4 rounded-xl border-2 p-5 text-left transition-all',
                  sendOption === 'reserved' ? 'border-primary bg-gray-50' : 'border-border hover:border-gray-300'
                )}
              >
                <div className="text-primary">📅</div>
                <div>
                  <p className="font-medium">예약 발송</p>
                  <p className="text-sm text-muted-foreground">지정한 날짜와 시간에 자동 발송합니다</p>
                </div>
              </button>
              {sendOption === 'reserved' && (
                <div className="ml-12 rounded-xl border border-border bg-white p-4">
                  <div className="flex gap-4">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">날짜</label>
                      <input type="date" className="rounded-lg border border-border px-3 py-2 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">시간</label>
                      <input type="time" className="rounded-lg border border-border px-3 py-2 text-sm outline-none" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <button
            onClick={() => navigate('/marketing/crm')}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            취소
          </button>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                이전
              </button>
            )}
            <button className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted">
              임시저장
            </button>
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-gray-800"
              >
                다음
              </button>
            ) : (
              <button className="flex items-center gap-2 rounded-lg bg-kakao px-5 py-2.5 text-sm font-medium text-kakao-foreground transition-colors hover:bg-yellow-400">
                <Send size={14} />
                발송하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
