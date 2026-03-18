import { useState, useMemo } from 'react';
import { Plus, Paintbrush, Check, Eye, Pause, FileEdit, XCircle, Layout, Settings, Users, ChevronDown, ChevronUp, Target, Calendar, RefreshCw, Clock, Timer, MousePointer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { WizardEditorLayout } from '@/components/common/WizardEditorLayout';
import { BannerStatusTable } from '@/components/pages/event-banner/BannerStatusTable';
import { BannerPreviewPanel } from '@/components/pages/event-banner/BannerPreviewPanel';
import { BannerTypeStep } from '@/components/pages/event-banner/steps/BannerTypeStep';
import { BannerContentStep } from '@/components/pages/event-banner/steps/BannerContentStep';
import { BannerContentSettingsStep } from '@/components/pages/event-banner/steps/BannerContentSettingsStep';
import { BannerAudienceStep } from '@/components/pages/event-banner/steps/BannerAudienceStep';
import { BannerDeliveryStep } from '@/components/pages/event-banner/steps/BannerDeliveryStep';
import { useBannerList, useBannerTemplates } from '@/hooks/client/banners/useBannersClient';
import { useBannerManagementStore } from '@/store/useBannerManagementStore';
import { useCompanyInfoStore } from '@/store/useCompanyInfoStore';
import { BANNER_STATUS, BANNER_FORMAT_WITHOUT_SUBTYPE } from '@/models/type';
import type { BannerPurposeType, BannerSubType } from '@/models/type';
import type { IWizardStep } from '@/components/common/WizardStepIndicator';

function getBannerSteps(subType: string | null): IWizardStep[] {
  return [
    { id: 1, label: '배너 유형', icon: <Paintbrush size={14} />, badge: subType ?? undefined },
    { id: 2, label: '템플릿 선택', icon: <Layout size={14} /> },
    { id: 3, label: '콘텐츠 설정', icon: <Settings size={14} /> },
    { id: 4, label: '오디언스 설정', icon: <Users size={14} /> },
    { id: 5, label: '발송 조건 설정', icon: <Settings size={14} /> },
  ];
}

/** 템플릿 선택 시 자동 생성되는 추천 문구 */
const TEMPLATE_SUGGESTIONS: Record<string, string> = {
  t1: '오랜만에 방문하신 고객님께 특별 할인 쿠폰을 드립니다. 지금 바로 확인해보세요!',
  t2: '신규 고객님을 위한 특별 혜택이 준비되어 있어요. 첫 구매 시 20% 할인!',
  t3: '이번 시즌 신상품을 먼저 만나보세요. 한정 수량 특별가로 제공됩니다.',
  t4: '오늘 하루 한정! 기간 한정 할인으로, 절대 놓치지마세요!',
  t5: '소중한 후기를 남겨주시면 다음 방문 시 특별 혜택을 드립니다.',
  t6: '수강 등록 시 첫 달 50% 할인! 이번 기회를 놓치지 마세요.',
  t7: '3일 무료 체험으로 시작해보세요. 부담 없이 경험해보실 수 있어요.',
  t8: '건강한 반려동물을 위한 정기 검진, 지금 예약하시면 10% 할인!',
};

/** 타겟팅 요약 컴포넌트 */
function TargetingSummary({ audience }: { audience: import('@/components/pages/event-banner/steps/BannerAudienceStep').IAudienceState }) {
  const [isOpen, setIsOpen] = useState(true);

  const customerLabel = audience.targetCustomer === 'all' ? '전체 고객' : audience.targetCustomer === 'loggedIn' ? '로그인' : '비로그인';
  const dayLabel = audience.allDays
    ? '모든 요일'
    : audience.visitDays.length > 0
      ? audience.visitDays.join(', ')
      : '미설정';

  return (
    <div className="rounded-xl border border-border/60 bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left"
      >
        <span className="text-xs font-semibold">타겟팅 요약</span>
        {isOpen ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
      </button>
      {isOpen && (
        <div className="space-y-1.5 border-t border-border/40 px-3 pb-3 pt-2">
          <SummaryRow icon={<Target size={11} />} text={customerLabel} />
          {audience.activeItems.includes('visitDay') && (
            <SummaryRow icon={<Calendar size={11} />} text={dayLabel} />
          )}
          {audience.activeItems.includes('visitCount') && (
            <SummaryRow icon={<RefreshCw size={11} />} text={`${audience.visitCount}회 이상`} />
          )}
          {audience.activeItems.includes('revisitPeriod') && (
            <SummaryRow icon={<Clock size={11} />} text={audience.revisitPeriodPreset} />
          )}
          {audience.activeItems.includes('stayTime') && (
            <SummaryRow icon={<Timer size={11} />} text={`${audience.stayTimeValue}분 이후`} />
          )}
          {audience.activeItems.includes('mouseScroll') && (
            <SummaryRow icon={<MousePointer size={11} />} text={`${audience.scrollPercent}% 스크롤`} />
          )}
        </div>
      )}
    </div>
  );
}

function SummaryRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {icon}
      <span>{text}</span>
    </div>
  );
}

export function EventBannerManagementPage() {
  const [statusFilter, setStatusFilter] = useState('전체');
  const store = useBannerManagementStore();
  const companyInfo = useCompanyInfoStore();
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

  const handleSave = () => {
    store.resetCreate();
    store.setActiveTab('list');
  };

  const handleBack = () => {
    store.resetCreate();
    store.setActiveTab('list');
  };

  // 띠배너/이탈감지는 세부유형 불필요
  const needsSubType = store.selectedBannerFormat && !BANNER_FORMAT_WITHOUT_SUBTYPE.includes(store.selectedBannerFormat);

  const canNext: Record<number, boolean> = {
    1: !!store.selectedBannerFormat && (!needsSubType || !!store.selectedSubType),
    2: !!store.selectedTemplate,
    3: true,
    4: true,
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
        steps={getBannerSteps(store.selectedSubType)}
        currentStep={store.currentStep}
        onStepClick={store.setCurrentStep}
        onPrev={() => store.setCurrentStep(store.currentStep - 1)}
        onNext={() => {
          if (canNext[store.currentStep]) {
            store.setCurrentStep(store.currentStep + 1);
          }
        }}
        canNext={canNext[store.currentStep]}
        isLastStep={store.currentStep === 5}
        lastStepLabel="저장하기"
        onLastStepAction={handleSave}
        sidebarFooter={
          <TargetingSummary audience={store.audience} />
        }
        preview={
          <BannerPreviewPanel
            selectedBannerFormat={store.selectedBannerFormat}
            selectedTemplate={store.selectedTemplate}
            generatedPreview={store.generatedPreview}
            currentStep={store.currentStep}
            subType={needsSubType ? store.selectedSubType : '기본형'}
            mainTitle={store.mainTitle}
            subTitle={store.subTitle}
            bodyText={store.bodyText}
            iconBgColor={store.iconBgColor}
            promoCards={store.promoCards}
            youtubeUrl={store.youtubeUrl}
            consentGuideText={store.consentGuideText}
            consentButtonLabel={store.consentButtonLabel}
            audience={store.audience}
            delivery={store.delivery}
            onSuggestionSelect={store.setGeneratedPreview}
          />
        }
      >
        {store.currentStep === 1 && (
          <BannerTypeStep
            selectedBannerType={store.selectedBannerFormat}
            onBannerTypeChange={store.setSelectedBannerFormat}
            selectedSubType={store.selectedSubType}
            onSubTypeChange={(st) => store.setSelectedSubType(st as BannerSubType)}
          />
        )}

        {store.currentStep === 2 && (
          <BannerContentStep
            templates={templates}
            selectedPurpose={store.selectedPurpose}
            selectedTemplate={store.selectedTemplate}
            bannerFormat={store.selectedBannerFormat}
            onPurposeChange={(p) => store.setSelectedPurpose(p as BannerPurposeType | '전체')}
            onSelectTemplate={(t) => {
              store.setSelectedTemplate(t);
              // 추천 문구 자동 생성
              const suggestion = TEMPLATE_SUGGESTIONS[t.id] ?? `${t.industry} ${t.purpose} 배너입니다.`;
              store.setGeneratedPreview(suggestion);
              // 예시 프롬프트
              const industryContext = companyInfo.businessCategory || companyInfo.businessType || t.industry;
              store.setPrompt(`${industryContext} ${t.purpose} ${t.bannerType} 배너. 대상: ${t.targetCustomer}.`);
            }}
          />
        )}

        {store.currentStep === 3 && (
          <BannerContentSettingsStep
            subType={needsSubType ? store.selectedSubType : '기본형'}
            iconBgColor={store.iconBgColor}
            mainTitle={store.mainTitle}
            subTitle={store.subTitle}
            bodyText={store.bodyText}
            onIconBgColorChange={store.setIconBgColor}
            onMainTitleChange={store.setMainTitle}
            onSubTitleChange={store.setSubTitle}
            onBodyTextChange={store.setBodyText}
            promoCards={store.promoCards}
            onPromoCardsChange={store.setPromoCards}
            youtubeUrl={store.youtubeUrl}
            youtubeAutoPlay={store.youtubeAutoPlay}
            onYoutubeUrlChange={store.setYoutubeUrl}
            onYoutubeAutoPlayChange={store.setYoutubeAutoPlay}
            instaFeedType={store.instaFeedType}
            onInstaFeedTypeChange={store.setInstaFeedType}
            consentGuideText={store.consentGuideText}
            consentButtonLabel={store.consentButtonLabel}
            onConsentGuideTextChange={store.setConsentGuideText}
            onConsentButtonLabelChange={store.setConsentButtonLabel}
          />
        )}

        {store.currentStep === 4 && (
          <BannerAudienceStep
            audience={store.audience}
            onChange={store.setAudience}
          />
        )}

        {store.currentStep === 5 && (
          <BannerDeliveryStep
            delivery={store.delivery}
            onChange={store.setDelivery}
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
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
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
