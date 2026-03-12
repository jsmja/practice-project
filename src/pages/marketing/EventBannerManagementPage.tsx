import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/common/PageHeader';
import { AiBannerGenerator } from '@/components/pages/event-banner/AiBannerGenerator';
import { TemplateGrid } from '@/components/pages/event-banner/TemplateGrid';
import { BannerStatusTable } from '@/components/pages/event-banner/BannerStatusTable';
import { useBannerList, useBannerTemplates } from '@/hooks/client/banners/useBannersClient';
import { useBannerManagementStore } from '@/store/useBannerManagementStore';
import type { BannerIndustryType, BannerPurposeType } from '@/models/type';

const GENERATED_PREVIEWS = [
  '🌸 봄 신메뉴 출시! 지금 주문하면 20% 할인',
  '💄 3개월 만에 돌아오셨군요! 특별 재방문 쿠폰 드립니다',
  '💪 지금 등록하면 3개월 + 1개월 무료! 이번 달 한정',
  '🌿 이번 시즌 신상품을 먼저 만나보세요',
  '⭐ 방문해 주셔서 감사합니다! 리뷰 작성 시 혜택 제공',
];

export function EventBannerManagementPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [statusFilter, setStatusFilter] = useState('전체');

  const {
    selectedIndustry,
    selectedPurpose,
    prompt,
    isGenerating,
    generatedPreview,
    selectedTemplate,
    setSelectedIndustry,
    setSelectedPurpose,
    setPrompt,
    setIsGenerating,
    setGeneratedPreview,
    setSelectedTemplate,
    resetCreate,
  } = useBannerManagementStore();

  const { data: banners = [] } = useBannerList();
  const { data: templates = [] } = useBannerTemplates();

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedPreview(null);

    // AI 생성 시뮬레이션
    setTimeout(() => {
      const preview = GENERATED_PREVIEWS[Math.floor(Math.random() * GENERATED_PREVIEWS.length)];
      setGeneratedPreview(preview);
      setIsGenerating(false);
    }, 1800);
  };

  const handleSave = () => {
    resetCreate();
    setActiveTab('list');
  };

  return (
    <div>
      <PageHeader
        title="이벤트 배너 관리"
        description="고객에게 노출할 팝업 배너를 만들고 관리합니다"
        actions={
          <button
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            <Plus size={15} />
            배너 만들기
          </button>
        }
      />

      {/* 탭 */}
      <div className="mb-6 flex gap-0 border-b border-border">
        {(['list', 'create'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-5 py-2.5 text-sm font-medium transition-colors',
              activeTab === tab
                ? 'border-b-2 border-foreground text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab === 'list' ? '배너 현황' : '배너 만들기'}
          </button>
        ))}
      </div>

      {activeTab === 'list' && (
        <BannerStatusTable
          banners={banners}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      )}

      {activeTab === 'create' && (
        <div className="grid grid-cols-[1fr_340px] gap-6">
          {/* 왼쪽: 템플릿 선택 */}
          <div>
            <div className="mb-4">
              <h3 className="mb-0.5 text-sm font-semibold">업종/목적별 추천 템플릿</h3>
              <p className="text-xs text-muted-foreground">
                업종과 목적에 맞는 템플릿을 선택하면 AI가 최적화된 배너를 제안합니다
              </p>
            </div>
            <TemplateGrid
              templates={templates}
              selectedIndustry={selectedIndustry}
              selectedPurpose={selectedPurpose}
              selectedTemplate={selectedTemplate}
              onIndustryChange={(ind) => setSelectedIndustry(ind as BannerIndustryType | '전체')}
              onPurposeChange={(p) => setSelectedPurpose(p as BannerPurposeType | '전체')}
              onSelectTemplate={(t) => {
                setSelectedTemplate(t);
                if (!prompt) {
                  setPrompt(`${t.industry} ${t.purpose} 배너. 대상: ${t.targetCustomer}.`);
                }
              }}
            />
          </div>

          {/* 오른쪽: AI 생성기 */}
          <div className="sticky top-4">
            <AiBannerGenerator
              prompt={prompt}
              isGenerating={isGenerating}
              generatedPreview={generatedPreview}
              selectedTemplate={selectedTemplate}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
              onReset={() => setGeneratedPreview(null)}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}
