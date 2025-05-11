import { defineStore } from 'pinia';
import type { Entry } from 'src/models/entryModels';
import { acceptHMRUpdate } from 'pinia';

type MonthlySummary = {
  monthKey: string; // Formato 'YYYY-MM'
  income: number;
  expenses: number;
  balance: number;
  entryCount: number;
};

export const useMonthlyStore = defineStore('monthly', {
  state: () => ({
    currentMonthEntries: [] as Entry[],
    archivedMonths: {} as Record<string, MonthlySummary>,
  }),

  persist: true,

  actions: {
    initializeMonth() {
      const currentMonth = new Date().toISOString().slice(0, 7);

      console.log('Inicializando mes:', currentMonth);

      if (!this.archivedMonths[currentMonth]) {
        this.currentMonthEntries = [];
        this.archivedMonths[currentMonth] = this.createMonthlySummary(currentMonth);
        console.log('Nuevo mes creado:', this.archivedMonths[currentMonth]);
      }
    },

    createMonthlySummary(monthKey: string): MonthlySummary {
      return {
        monthKey,
        income: 0,
        expenses: 0,
        balance: 0,
        entryCount: 0,
      };
    },

    archiveCurrentMonth() {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const summary = this.calculateMonthlySummary(currentMonth);
      this.archivedMonths[currentMonth] = summary;
      this.currentMonthEntries = [];
    },

    calculateMonthlySummary(monthKey: string): MonthlySummary {
      return this.currentMonthEntries.reduce((acc, entry) => {
        acc.entryCount++;
        if (entry.amount >= 0) {
          acc.income += entry.amount;
        } else {
          acc.expenses += Math.abs(entry.amount);
        }
        acc.balance += entry.amount;
        return acc;
      }, this.createMonthlySummary(monthKey));
    },
    addMockData() {
      console.log('entrada');

      // 1. Limpiar datos existentes
      const currentMonth = new Date().toISOString().slice(0, 7);

      // 2. Agregar datos de prueba
      this.currentMonthEntries = [
        { id: '1', name: 'Salario', amount: 2500, date: new Date().toISOString() },
        { id: '2', name: 'Alquiler', amount: -800, date: new Date().toISOString() },
        { id: '3', name: 'Supermercado', amount: -350, date: new Date().toISOString() },
      ];

      // 3. Agregar meses anteriores SIN borrar el mes actual
      this.archivedMonths = {
        '2024-04': {
          monthKey: '2024-04',
          income: 3000,
          expenses: 1200,
          balance: 1800,
          entryCount: 5,
        },
        '2024-03': {
          monthKey: '2024-03',
          income: 2800,
          expenses: 1500,
          balance: 1300,
          entryCount: 7,
        },
      };

      // 4. Archivar mes actual
      this.archivedMonths[currentMonth] = this.calculateMonthlySummary(currentMonth);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMonthlyStore, import.meta.hot));
}
