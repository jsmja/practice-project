import { useState, useMemo } from 'react';
import { Plus, Paintbrush, Check, Eye, Pause, FileEdit, XCircle, CheckCircle, Ban, CircleStop, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { WizardEditorLayout } from '@/components/common/WizardEditorLayout';
import { BannerStatusTable } from '@/components/pages/event-banner/BannerStatusTable';
import { BannerPreviewPanel } from '@/components/pages/event-banner/BannerPreviewPanel';
import { AiBannerGenerator } from '@/components/pages/event-banner/AiBannerGenerator';
import { BannerTypeStep } from '@/components/pages/event-banner/steps/BannerTypeStep';
import { BannerContentStep } from '@/components/pages/event-banner/steps/BannerContentStep';
import { BannerTargetStep } from '@/components/pages/event-banner/steps/BannerTargetStep';
import { BannerConfirmStep } from '@/components/pages/event-banner/steps/BannerConfirmStep';
import { useBannerList, useBannerTemplates } from '@/hooks/client/banners/useBannersClient';
import { useBannerManagementStore } from '@/store/useBannerManagementStore';
import { BANNER_STATUS } from '@/models/type';
import type { BannerFormatType, BannerIndustryType, BannerPurposeType } from '@/models/type';
import type { IWizardStep } from '@/components/common/WizardStepIndicator';

const BANNER_STEPS: IWizardStep[] = [
  { id: 1, label: '배너 유형', icon: <Paintbrush size={14} /> },
  { id: 2, label: '콘텐츠 설정', icon: <Paintbrush size={14} /> },
  { id: 3, label: '노출 대상', icon: <Paintbrush size={14} /> },
  { id: 4, label: '최종 확인', icon: <Check size={14} /> },
];

const GENERATED_PREVIEWS = [
  '🌸 봄 신메뉴 출시! 지금 주문하면 20% 할인',
  '💄 3개월 만에 돌아오셨군요! 특별 재방문 쿠폰 드립니다',
  '💪 지금 등록하면 3개월 + 1개월 무료! 이번 달 한정',
  '🌿 이번 시즌 신상품을 먼저 만나보세요',
  '⭐ 방문해 주셔서 감사합니다! 리뷰 작성 시 혜택 제공',
];

export function EventBannerManagementPage() {
  const [statusFilter, setStatusFilter] = useState('전체');
  const store = useBannerManagementStore();
  const { data: banners = [] } = useBannerList();
  const { data: templates = [] } = useBannerTemplates();

  // 상태별 카운트
  const activeCount = useMemo(() => banners.filter((b) => b.status === BANNER_STATUS.ACTIVE).length, [banners]);
  const pausedCount = useMemo(() => banners.filter((b) => b.status === BANNER_STATUS.PAUSED).length, [banners]);
  const draftCount = useMemo(() => banners.filter((b) => b.status === BANNER_STATUS.DRAFT).length, [banners]);
  const endedCount = useMemo(() => banners.filter((b) => b.status === BANNER_STATUS.ENDED).length, [banners]);

  const handleStatCardClick = (status: string) => {
    setStatusFilter(statusFilter === status ? '전체' : status);
  };

  const handleGenerate = () => {
    store.setIsGenerating(true);
    store.setGeneratedPreview(null);
    setTimeout(() => {
      const preview = GENERATED_PREVIEWS[Math.floor(Math.random() * GENERATED_PREVIEWS.length)];
      store.setGeneratedPreview(preview);
      store.setIsGenerating(false);
    }, 1800);
  };

  const handleSave = () => {
    store.resetCreate();
    store.setActiveTab('list');
  };

  const handleBack = () => {
    store.resetCreate();
    store.setActiveTab('list');
  };

  const canNext: Record<number, boolean> = {
    1: !!store.selectedBannerFormat,
    2: !!store.selectedTemplate,
    3: true,
  };

  // ── 배너 만들기 모드 (3컬럼 위자드 에디터) ──
  if (store.activeTab === 'create') {
    return (
      <WizardEditorLayout
        name={store.bannerName}
        namePlaceholder="배너 이름을 입력하세요"
        onNameChange={store.setBannerName}
        onBack={handleBack}
        isActive={store.isActive}
        onActiveChange={store.setIsActive}
        onDraftSave={() => {}}
        steps={BANNER_STEPS}
        currentStep={store.currentStep}
        onStepClick={store.setCurrentStep}
        onPrev={() => store.setCurrentStep(store.currentStep - 1)}
        onNext={() => {
          if (canNext[store.currentStep]) {
            store.setCurrentStep(store.currentStep + 1);
          }
        }}
        canNext={canNext[store.currentStep]}
        isLastStep={store.currentStep === 4}
        lastStepLabel="저장하기"
        onLastStepAction={handleSave}
        preview={
          store.currentStep === 2 ? (
            <div className="p-5">
              <AiBannerGenerator
                prompt={store.prompt}
                isGenerating={store.isGenerating}
                generatedPreview={store.generatedPreview}
                selectedTemplate={store.selectedTemplate}
                onPromptChange={store.setPrompt}
                onGenerate={handleGenerate}
                onReset={() => store.setGeneratedPreview(null)}
                onSave={() => {}}
              />
            </div>
          ) : (
            <BannerPreviewPanel
              bannerName={store.bannerName}
              selectedBannerFormat={store.selectedBannerFormat}
              selectedTemplate={store.selectedTemplate}
              generatedPreview={store.generatedPreview}
              targetGrade={store.targetGrade}
              targetGender={store.targetGender}
              targetAgeGroup={store.targetAgeGroup}
              displaySchedule={store.displaySchedule}
              displayStartDate={store.displayStartDate}
              displayEndDate={store.displayEndDate}
              isActive={store.isActive}
              currentStep={store.currentStep}
            />
          )
        }
      >
        {store.currentStep === 1 && (
          <BannerTypeStep
            selectedBannerType={store.selectedBannerFormat}
            onBannerTypeChange={store.setSelectedBannerFormat}
          />
        )}

        {store.currentStep === 2 && (
          <BannerContentStep
            templates={templates}
            selectedIndustry={store.selectedIndustry}
            selectedPurpose={store.selectedPurpose}
            selectedBannerType={store.selectedBannerType}
            selectedTemplate={store.selectedTemplate}
            onIndustryChange={(ind) => store.setSelectedIndustry(ind as BannerIndustryType | '전체')}
            onPurposeChange={(p) => store.setSelectedPurpose(p as BannerPurposeType | '전체')}
            onBannerTypeChange={(fmt) => store.setSelectedBannerType(fmt as BannerFormatType | '전체')}
            onSelectTemplate={(t) => {
              store.setSelectedTemplate(t);
              if (!store.prompt) {
                store.setPrompt(`${t.industry} ${t.purpose} ${t.bannerType} 배너. 대상: ${t.targetCustomer}.`);
              }
            }}
          />
        )}

        {store.currentStep === 3 && (
          <BannerTargetStep
            targetGrade={store.targetGrade}
            targetGender={store.targetGender}
            targetAgeGroup={store.targetAgeGroup}
            displaySchedule={store.displaySchedule}
            displayStartDate={store.displayStartDate}
            displayEndDate={store.displayEndDate}
            onTargetGradeChange={store.setTargetGrade}
            onTargetGenderChange={store.setTargetGender}
            onTargetAgeGroupChange={store.setTargetAgeGroup}
            onDisplayScheduleChange={store.setDisplaySchedule}
            onDisplayStartDateChange={store.setDisplayStartDate}
            onDisplayEndDateChange={store.setDisplayEndDate}
          />
        )}

        {store.currentStep === 4 && (
          <BannerConfirmStep
            bannerName={store.bannerName}
            selectedBannerType={store.selectedBannerFormat}
            selectedTemplate={store.selectedTemplate}
            generatedPreview={store.generatedPreview}
            targetGrade={store.targetGrade}
            targetGender={store.targetGender}
            targetAgeGroup={store.targetAgeGroup}
            displaySchedule={store.displaySchedule}
            displayStartDate={store.displayStartDate}
            displayEndDate={store.displayEndDate}
            isActive={store.isActive}
          />
        )}
      </WizardEditorLayout>
    );
  }

  // ── 배너 현황 (리스트) 모드 ──
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="마케팅 배너 관리"
        description="고객에게 노출할 마케팅 팝업을 만들고 관리합니다"
        actions={
          <button
            onClick={() => store.setActiveTab('create')}
            className="flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            <Plus size={15} />
            배너 만들기
          </button>
        }
      />

      {/* 상태별 StatCard */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="운영중"
          value={activeCount}
          icon={<Eye size={18} />}
          isActive={statusFilter === BANNER_STATUS.ACTIVE}
          onClick={() => handleStatCardClick(BANNER_STATUS.ACTIVE)}
        />
        <StatCard
          title="일시중지"
          value={pausedCount}
          icon={<Pause size={18} />}
          isActive={statusFilter === BANNER_STATUS.PAUSED}
          onClick={() => handleStatCardClick(BANNER_STATUS.PAUSED)}
        />
        <StatCard
          title="임시저장"
          value={draftCount}
          icon={<FileEdit size={18} />}
          isActive={statusFilter === BANNER_STATUS.DRAFT}
          onClick={() => handleStatCardClick(BANNER_STATUS.DRAFT)}
        />
        <StatCard
          title="종료"
          value={endedCount}
          icon={<XCircle size={18} />}
          isActive={statusFilter === BANNER_STATUS.ENDED}
          onClick={() => handleStatCardClick(BANNER_STATUS.ENDED)}
        />
      </div>

      <BannerStatusTable
        banners={banners}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
    </div>
  );
}
