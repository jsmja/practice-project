import { create } from 'zustand';
import type { IBannerTemplateDto } from '@/models/interface/dto';
import type { BannerFormatType, BannerIndustryType, BannerPurposeType } from '@/models/type';

interface IBannerManagementState {
  // 탭
  activeTab: 'list' | 'create';
  // 위자드 스텝
  currentStep: number;
  bannerName: string;
  isActive: boolean;
  // Step 1: 배너 유형
  selectedBannerFormat: BannerFormatType | null;
  // Step 2: 콘텐츠
  selectedIndustry: BannerIndustryType | '전체';
  selectedPurpose: BannerPurposeType | '전체';
  selectedBannerType: BannerFormatType | '전체';
  selectedTemplate: IBannerTemplateDto | null;
  prompt: string;
  isGenerating: boolean;
  generatedPreview: string | null;
  // Step 3: 타겟
  targetGrade: string;
  targetGender: string;
  targetAgeGroup: string;
  displaySchedule: 'always' | 'scheduled';
  displayStartDate: string;
  displayEndDate: string;
  // Actions
  setActiveTab: (tab: 'list' | 'create') => void;
  setCurrentStep: (step: number) => void;
  setBannerName: (name: string) => void;
  setIsActive: (active: boolean) => void;
  setSelectedBannerFormat: (format: BannerFormatType | null) => void;
  setSelectedIndustry: (industry: BannerIndustryType | '전체') => void;
  setSelectedPurpose: (purpose: BannerPurposeType | '전체') => void;
  setSelectedBannerType: (bannerType: BannerFormatType | '전체') => void;
  setSelectedTemplate: (template: IBannerTemplateDto | null) => void;
  setPrompt: (prompt: string) => void;
  setIsGenerating: (generating: boolean) => void;
  setGeneratedPreview: (preview: string | null) => void;
  setTargetGrade: (grade: string) => void;
  setTargetGender: (gender: string) => void;
  setTargetAgeGroup: (ageGroup: string) => void;
  setDisplaySchedule: (schedule: 'always' | 'scheduled') => void;
  setDisplayStartDate: (date: string) => void;
  setDisplayEndDate: (date: string) => void;
  resetCreate: () => void;
}

const CREATE_INITIAL = {
  currentStep: 1,
  bannerName: '',
  isActive: true,
  selectedBannerFormat: null as BannerFormatType | null,
  selectedIndustry: '전체' as BannerIndustryType | '전체',
  selectedPurpose: '전체' as BannerPurposeType | '전체',
  selectedBannerType: '전체' as BannerFormatType | '전체',
  selectedTemplate: null as IBannerTemplateDto | null,
  prompt: '',
  isGenerating: false,
  generatedPreview: null as string | null,
  targetGrade: '전체',
  targetGender: '전체',
  targetAgeGroup: '전체',
  displaySchedule: 'always' as const,
  displayStartDate: '',
  displayEndDate: '',
};

export const useBannerManagementStore = create<IBannerManagementState>((set) => ({
  activeTab: 'list',
  ...CREATE_INITIAL,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setBannerName: (name) => set({ bannerName: name }),
  setIsActive: (active) => set({ isActive: active }),
  setSelectedBannerFormat: (format) => set({ selectedBannerFormat: format }),
  setSelectedIndustry: (industry) => set({ selectedIndustry: industry }),
  setSelectedPurpose: (purpose) => set({ selectedPurpose: purpose }),
  setSelectedBannerType: (bannerType) => set({ selectedBannerType: bannerType }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  setPrompt: (prompt) => set({ prompt }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setGeneratedPreview: (preview) => set({ generatedPreview: preview }),
  setTargetGrade: (grade) => set({ targetGrade: grade }),
  setTargetGender: (gender) => set({ targetGender: gender }),
  setTargetAgeGroup: (ageGroup) => set({ targetAgeGroup: ageGroup }),
  setDisplaySchedule: (schedule) => set({ displaySchedule: schedule }),
  setDisplayStartDate: (date) => set({ displayStartDate: date }),
  setDisplayEndDate: (date) => set({ displayEndDate: date }),
  resetCreate: () => set(CREATE_INITIAL),
}));
