import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IServiceState {
  kakaoLinked: boolean;
  setKakaoLinked: (linked: boolean) => void;
}

export const useServiceStore = create<IServiceState>()(
  persist(
    (set) => ({
      kakaoLinked: false,
      setKakaoLinked: (linked) => set({ kakaoLinked: linked }),
    }),
    { name: 'service-state' }
  )
);
