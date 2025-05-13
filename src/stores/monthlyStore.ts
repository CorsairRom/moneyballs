import { defineStore } from 'pinia';
import type { Entry } from 'src/models/entryModels';
import { acceptHMRUpdate } from 'pinia';
import mockData from 'src/models/mockData.json'; // Asegúrate de que la ruta sea correcta
import { useEntriesStore } from 'src/stores/example-store';
import { useSettingStore } from 'src/stores/settingStore';
type historyMonthyData = {
  monthKey: string;
  income: number;
  expenses: number;
  monthyBalance: number;
  entryCount: number;
  AllMonthyEntry: Entry[];
};

export const useMonthlyStore = defineStore('monthly', {
  state: () => ({
    archivedMonths: {} as Record<string, historyMonthyData>,
  }),

  persist: true,

  getters: {
    getMonthlyData: (state) => (monthKey: string) => {
      return state.archivedMonths[monthKey] || null;
    },
  },

  actions: {
    initializeMonth() {
      const settingStore = useSettingStore();
      const entryStore = useEntriesStore();
      if (
        !settingStore.settings ||
        settingStore.settings.dayEndMonth === undefined ||
        settingStore.settings.initialSalary === undefined
      ) {
        console.warn('[initializeMonth] No hay configuración en settingStore. Abortando.');
        return;
      }
      const currentDate = new Date();
      const today = currentDate.getDate();
      const currentMonth = currentDate.toISOString().slice(0, 7);
      if (today !== settingStore.settings.dayEndMonth) {
        console.log(
          `[initializeMonth] Hoy no es el día de inicialización (${today} ≠ ${settingStore.settings.dayEndMonth})`,
        );
        return;
      }
      if (this.archivedMonths[currentMonth]) {
        console.log(`[initializeMonth] El mes ${currentMonth} ya está inicializado.`);
        return;
      }
      console.log('Inicializando mes:', currentMonth);
      entryStore.addEntry({
        id: crypto.randomUUID(),
        name: 'Saldo inicial',
        amount: settingStore.settings.initialSalary,
        date: new Date().toISOString(),
      });
      this.archivedMonths[currentMonth] = this.calculateMonthlySummary(currentMonth);
      console.log('Nuevo mes creado:', this.archivedMonths[currentMonth]);
    },

    archiveCurrentMonth(monthKey: string) {
      const entryStore = useEntriesStore();
      const entries = entryStore.getAllEntries();

      if (entries.length > 0) {
        this.archivedMonths[monthKey] = this.calculateMonthlySummary(monthKey);
        this.archivedMonths[monthKey].AllMonthyEntry = entries;
        this.archivedMonths[monthKey].entryCount = entries.length;
        this.archivedMonths[monthKey].income = entries.reduce(
          (sum, entry) => (entry.amount > 0 ? sum + entry.amount : sum),
          0,
        );
        this.archivedMonths[monthKey].expenses = entries.reduce(
          (sum, entry) => (entry.amount < 0 ? sum + Math.abs(entry.amount) : sum),
          0,
        );
        this.archivedMonths[monthKey].monthyBalance =
          this.archivedMonths[monthKey].income - this.archivedMonths[monthKey].expenses;
        console.log('Mes archivado:', this.archivedMonths[monthKey]);
      }
    },

    createMonthlySummary(monthKey: string): historyMonthyData {
      return {
        monthKey,
        income: 0,
        expenses: 0,
        monthyBalance: 0,
        entryCount: 0,
        AllMonthyEntry: [],
      };
    },

    calculateMonthlySummary(monthKey: string) {
      const entryStore = useEntriesStore();
      const entries = entryStore.getAllEntries();
      const summary = this.createMonthlySummary(monthKey);

      entries.forEach((entry) => {
        summary.entryCount++;
        if (entry.amount >= 0) {
          summary.income += entry.amount;
        } else {
          summary.expenses += Math.abs(entry.amount);
        }
      });

      summary.monthyBalance = summary.income - summary.expenses;
      summary.AllMonthyEntry = entries;

      return summary;
    },

    addMockData() {
      this.archivedMonths = {};

      mockData.forEach((month) => {
        const monthKey = month.monthKey;
        const entries = month.entries;

        this.archivedMonths[monthKey] = this.createMonthlySummary(monthKey);
        this.archivedMonths[monthKey].AllMonthyEntry = entries;
        this.archivedMonths[monthKey].entryCount = entries.length;
        this.archivedMonths[monthKey].income = entries.reduce(
          (sum, entry) => (entry.amount > 0 ? sum + entry.amount : sum),
          0,
        );
        this.archivedMonths[monthKey].expenses = entries.reduce(
          (sum, entry) => (entry.amount < 0 ? sum + Math.abs(entry.amount) : sum),
          0,
        );
        this.archivedMonths[monthKey].monthyBalance =
          this.archivedMonths[monthKey].income - this.archivedMonths[monthKey].expenses;
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMonthlyStore, import.meta.hot));
}
