import { defineStore } from 'pinia';
import { acceptHMRUpdate } from 'pinia';

type SettingData = {
  dayEndMonth: number;
  initialSalary: number;
};

export const useSettingStore = defineStore('setting', {
  state: () => ({
    settings: {
      dayEndMonth: 4,
      initialSalary: 1600000,
    } as SettingData,
  }),

  persist: true,

  getters: {
    getDayEndMonth: (state) => state.settings.dayEndMonth,
    getInitialSalary: (state) => state.settings.initialSalary,
  },

  actions: {
    updateSettings(newSettings: Partial<SettingData>) {
      this.settings = { ...this.settings, ...newSettings };
    },

    shouldInitializeMonth(currentDay: number): boolean {
      return currentDay === this.settings.dayEndMonth;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot));
}
