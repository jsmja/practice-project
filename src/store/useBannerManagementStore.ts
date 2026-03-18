import { create } from 'zustand';
import type { IBannerTemplateDto } from '@/models/interface/dto';
import type { BannerFormatType, BannerIndustryType, BannerPurposeType, BannerSubType } from '@/models/type';
import type { IAudienceState } from '@/components/pages/event-banner/steps/BannerAudienceStep';
import { INITIAL_AUDIENCE } from '@/components/pages/event-banner/steps/BannerAudienceStep';
import type { IDeliveryState } from '@/components/pages/event-banner/steps/BannerDeliveryStep';
import { INITIAL_DELIVERY } from '@/components/pages/event-banner/steps/BannerDeliveryStep';

interface IPromoCard {
  id: number;
  imageUploaded: boolean;
  mainTitle: string;
  bodyText: string;
  buttonLabel: string;
}

interface IBannerManagementState {
  // 탭
  activeTab: 'list' | 'create';
  // 위자드 스텝
  currentStep: number;
  bannerName: string;
  isActive: boolean;
  // Step 1: 배너 유형 + 세부 유형
  selectedBannerFormat: BannerFormatType | null;
  selectedSubType: BannerSubType | null;
  // Step 2: 템플릿 선택
  selectedIndustry: BannerIndustryType | '전체';
  selectedPurpose: BannerPurposeType | '전체';
  selectedBannerType: BannerFormatType | '전체';
  selectedTemplate: IBannerTemplateDto | null;
  prompt: string;
  isGenerating: boolean;
  generatedPreview: string | null;
  // Step 3: 콘텐츠 설정
  // 기본형
  iconBgColor: string;
  mainTitle: string;
  subTitle: string;
  bodyText: string;
  // 프로모션형
  promoCards: IPromoCard[];
  // 유튜브형
  youtubeUrl: string;
  youtubeAutoPlay: boolean;
  // 인스타형
  instaFeedType: 'latest' | 'select';
  // 수신동의
  consentGuideText: string;
  consentButtonLabel: string;
  // Step 4: 오디언스
  audience: IAudienceState;
  // Step 5: 발송 조건
  delivery: IDeliveryState;
  // 레거시 (미리보기 호환)
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
  setSelectedSubType: (subType: BannerSubType | null) => void;
  setSelectedIndustry: (industry: BannerIndustryType | '전체') => void;
  setSelectedPurpose: (purpose: BannerPurposeType | '전체') => void;
  setSelectedBannerType: (bannerType: BannerFormatType | '전체') => void;
  setSelectedTemplate: (template: IBannerTemplateDto | null) => void;
  setPrompt: (prompt: string) => void;
  setIsGenerating: (generating: boolean) => void;
  setGeneratedPreview: (preview: string | null) => void;
  setIconBgColor: (color: string) => void;
  setMainTitle: (title: string) => void;
  setSubTitle: (title: string) => void;
  setBodyText: (text: string) => void;
  setPromoCards: (cards: IPromoCard[]) => void;
  setYoutubeUrl: (url: string) => void;
  setYoutubeAutoPlay: (autoPlay: boolean) => void;
  setInstaFeedType: (type: 'latest' | 'select') => void;
  setConsentGuideText: (text: string) => void;
  setConsentButtonLabel: (label: string) => void;
  setAudience: (audience: IAudienceState) => void;
  setDelivery: (delivery: IDeliveryState) => void;
  setTargetGrade: (grade: string) => void;
  setTargetGender: (gender: string) => void;
  setTargetAgeGroup: (ageGroup: string) => void;
  setDisplaySchedule: (schedule: 'always' | 'scheduled') => void;
  setDisplayStartDate: (date: string) => void;
  setDisplayEndDate: (date: string) => void;
  resetCreate: () => void;
}

const INITIAL_PROMO_CARD: IPromoCard = { id: 1, imageUploaded: false, mainTitle: '', bodyText: '', buttonLabel: '' };

const CREATE_INITIAL = {
  currentStep: 1,
  bannerName: '',
  isActive: true,
  selectedBannerFormat: null as BannerFormatType | null,
  selectedSubType: null as BannerSubType | null,
  selectedIndustry: '전체' as BannerIndustryType | '전체',
  selectedPurpose: '전체' as BannerPurposeType | '전체',
  selectedBannerType: '전체' as BannerFormatType | '전체',
  selectedTemplate: null as IBannerTemplateDto | null,
  prompt: '',
  isGenerating: false,
  generatedPreview: null as string | null,
  iconBgColor: '#717171',
  mainTitle: '',
  subTitle: '',
  bodyText: '',
  promoCards: [{ ...INITIAL_PROMO_CARD }] as IPromoCard[],
  youtubeUrl: '',
  youtubeAutoPlay: false,
  instaFeedType: 'latest' as const,
  consentGuideText: '',
  consentButtonLabel: '수신 동의',
  audience: { ...INITIAL_AUDIENCE },
  delivery: { ...INITIAL_DELIVERY },
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
  setSelectedSubType: (subType) => set({ selectedSubType: subType }),
  setSelectedIndustry: (industry) => set({ selectedIndustry: industry }),
  setSelectedPurpose: (purpose) => set({ selectedPurpose: purpose }),
  setSelectedBannerType: (bannerType) => set({ selectedBannerType: bannerType }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  setPrompt: (prompt) => set({ prompt }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setGeneratedPreview: (preview) => set({ generatedPreview: preview }),
  setIconBgColor: (color) => set({ iconBgColor: color }),
  setMainTitle: (title) => set({ mainTitle: title }),
  setSubTitle: (title) => set({ subTitle: title }),
  setBodyText: (text) => set({ bodyText: text }),
  setPromoCards: (cards) => set({ promoCards: cards }),
  setYoutubeUrl: (url) => set({ youtubeUrl: url }),
  setYoutubeAutoPlay: (autoPlay) => set({ youtubeAutoPlay: autoPlay }),
  setInstaFeedType: (type) => set({ instaFeedType: type }),
  setConsentGuideText: (text) => set({ consentGuideText: text }),
  setConsentButtonLabel: (label) => set({ consentButtonLabel: label }),
  setAudience: (audience) => set({ audience }),
  setDelivery: (delivery) => set({ delivery }),
  setTargetGrade: (grade) => set({ targetGrade: grade }),
  setTargetGender: (gender) => set({ targetGender: gender }),
  setTargetAgeGroup: (ageGroup) => set({ targetAgeGroup: ageGroup }),
  setDisplaySchedule: (schedule) => set({ displaySchedule: schedule }),
  setDisplayStartDate: (date) => set({ displayStartDate: date }),
  setDisplayEndDate: (date) => set({ displayEndDate: date }),
  resetCreate: () => set(CREATE_INITIAL),
}));

export type { IPromoCard };
