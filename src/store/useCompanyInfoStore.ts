import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ICompanyInfoState {
  companyName: string;
  ceoName: string;
  homepageUrl: string;
  businessName: string;
  businessType: string;
  businessCategory: string;
  setCompanyName: (name: string) => void;
  setCeoName: (name: string) => void;
  setHomepageUrl: (url: string) => void;
  setBusinessName: (name: string) => void;
  setBusinessType: (type: string) => void;
  setBusinessCategory: (category: string) => void;
}

export const useCompanyInfoStore = create<ICompanyInfoState>()(
  persist(
    (set) => ({
      companyName: '헤이데어',
      ceoName: '헤이데어',
      homepageUrl: 'https://hey-there.io/',
      businessName: '',
      businessType: '',
      businessCategory: '',
      setCompanyName: (name) => set({ companyName: name }),
      setCeoName: (name) => set({ ceoName: name }),
      setHomepageUrl: (url) => set({ homepageUrl: url }),
      setBusinessName: (name) => set({ businessName: name }),
      setBusinessType: (type) => set({ businessType: type }),
      setBusinessCategory: (category) => set({ businessCategory: category }),
    }),
    { name: 'company-info' }
  )
);
