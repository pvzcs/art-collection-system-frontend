import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'en' | 'zh';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'zh',
      setLocale: (locale: Locale) => set({ locale }),
    }),
    {
      name: 'locale-storage',
    }
  )
);
