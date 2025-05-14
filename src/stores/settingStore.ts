import { defineStore } from 'pinia';
import { acceptHMRUpdate } from 'pinia';

type SettingData = {
  dayEndMonth: number;
  initialSalary: number;
};

export const useSettingStore = defineStore('setting', {
  state: () => ({
    settings: {
      dayEndMonth: 1,
      initialSalary: 0,
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

    setDayEndMonth(day: number) {
      this.settings.dayEndMonth = day;
    },
    setInitialSalary(salary: number) {
      this.settings.initialSalary = salary;
    },

    shouldInitializeMonth(currentDay: number): boolean {
      return currentDay === this.settings.dayEndMonth;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot));
}
