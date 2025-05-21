import { defineStore } from 'pinia';
import { acceptHMRUpdate } from 'pinia';
import type { FixedExpense } from 'src/models/fixedExpenseModel';

type SettingData = {
  dayEndMonth: number;
  initialSalary: number;
  fixedExpenses: FixedExpense[];
};

export const useSettingStore = defineStore('setting', {
  state: () => ({
    settings: {
      dayEndMonth: 1,
      initialSalary: 0,
      fixedExpenses: [],
    } as SettingData,
  }),

  persist: true,

  getters: {
    getDayEndMonth: (state) => state.settings.dayEndMonth,
    getInitialSalary: (state) => state.settings.initialSalary,
    getFixedExpenses: (state) => state.settings.fixedExpenses,
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

    addFixedExpense(expense: FixedExpense) {
      this.settings.fixedExpenses.push(expense);
    },

    removeFixedExpense(expenseId: string) {
      this.settings.fixedExpenses = this.settings.fixedExpenses.filter(
        (expense) => expense.id !== expenseId,
      );
    },
    setMockData(option: string) {
      // Make sure to import DurationType from your model if not already imported
      // import type { DurationType } from 'src/models/fixedExpenseModel';

      const expenses: FixedExpense[] = [
        { id: '1', name: 'Alquiler', amount: 200000, duration: 'fixed', startDate: '2025-05-01' },
        { id: '2', name: 'Abogado', amount: 100000, duration: 1, startDate: '2025-05-01' },
        { id: '3', name: 'Prestamo-1', amount: 200000, duration: 3, startDate: '2025-05-01' },
        { id: '4', name: 'Prestamo-2', amount: 250000, duration: 6, startDate: '2025-05-01' },
      ];
      if (option == 'all') {
        this.settings = {
          dayEndMonth: 1,
          initialSalary: 1600000,
          fixedExpenses: expenses,
        };
      } else if (option == 'bills') {
        expenses.forEach((expense) => this.addFixedExpense(expense));
      }
    },
    removeAllData() {
      this.settings = {
        dayEndMonth: 1,
        initialSalary: 0,
        fixedExpenses: [],
      };
    },

    shouldInitializeMonth(currentDay: number): boolean {
      return currentDay === this.settings.dayEndMonth;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot));
}
