import { create } from 'zustand';
import { Setting } from '../types';

interface SettingsState {
  settings: Setting | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSettings: (settings: Setting) => void;
  updateSettings: (settings: Partial<Setting>) => void;
  toggleDarkMode: () => void;
  togglePushNotification: () => void;
  setLanguage: (language: string) => void;
  clearError: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  isLoading: false,
  error: null,

  setSettings: (settings: Setting) => {
    set({ settings });
  },

  updateSettings: (updatedSettings: Partial<Setting>) => {
    const { settings } = get();
    if (settings) {
      set({
        settings: {
          ...settings,
          ...updatedSettings,
        },
      });
    }
  },

  toggleDarkMode: () => {
    const { settings } = get();
    if (settings) {
      set({
        settings: {
          ...settings,
          darkMode: !settings.darkMode,
        },
      });
    }
  },

  togglePushNotification: () => {
    const { settings } = get();
    if (settings) {
      set({
        settings: {
          ...settings,
          pushNotification: !settings.pushNotification,
        },
      });
    }
  },

  setLanguage: (language: string) => {
    const { settings } = get();
    if (settings) {
      set({
        settings: {
          ...settings,
          language,
        },
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
