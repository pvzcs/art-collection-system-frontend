// Settings store placeholder
// Will be implemented in task 3.2

import { create } from 'zustand';

interface SettingsState {
  apiBaseUrl: string;
}

export const useSettingsStore = create<SettingsState>(() => ({
  apiBaseUrl: 'http://localhost:8080/api/v1',
}));
