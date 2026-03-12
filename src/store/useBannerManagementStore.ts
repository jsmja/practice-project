import { create } from 'zustand';
import type { IBannerTemplateDto } from '@/models/interface/dto';
import type { BannerIndustryType, BannerPurposeType } from '@/models/type';

interface IBannerManagementState {
  activeTab: 'list' | 'create';
  selectedIndustry: BannerIndustryType | '전체';
  selectedPurpose: BannerPurposeType | '전체';
  prompt: string;
  isGenerating: boolean;
  generatedPreview: string | null;
  selectedTemplate: IBannerTemplateDto | null;
  setActiveTab: (tab: 'list' | 'create') => void;
  setSelectedIndustry: (industry: BannerIndustryType | '전체') => void;
  setSelectedPurpose: (purpose: BannerPurposeType | '전체') => void;
  setPrompt: (prompt: string) => void;
  setIsGenerating: (generating: boolean) => void;
  setGeneratedPreview: (preview: string | null) => void;
  setSelectedTemplate: (template: IBannerTemplateDto | null) => void;
  resetCreate: () => void;
}

export const useBannerManagementStore = create<IBannerManagementState>((set) => ({
  activeTab: 'list',
  selectedIndustry: '전체',
  selectedPurpose: '전체',
  prompt: '',
  isGenerating: false,
  generatedPreview: null,
  selectedTemplate: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedIndustry: (industry) => set({ selectedIndustry: industry }),
  setSelectedPurpose: (purpose) => set({ selectedPurpose: purpose }),
  setPrompt: (prompt) => set({ prompt }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setGeneratedPreview: (preview) => set({ generatedPreview: preview }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  resetCreate: () =>
    set({
      prompt: '',
      isGenerating: false,
      generatedPreview: null,
      selectedTemplate: null,
    }),
}));
