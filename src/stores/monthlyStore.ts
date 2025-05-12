import { defineStore } from 'pinia';
import type { Entry } from 'src/models/entryModels';
import { acceptHMRUpdate } from 'pinia';
import { useEntriesStore } from 'src/stores/example-store';

type historyMonthyData = {
  monthKey: string;
  income: number;
  expenses: number;
  monthyBalance: number;
  entryCount: number;
  AllMonthyEntry: Entry[]; // Lista completa de transacciones
};

// export interface Entry {
//   id: string;
//   name: string;
//   amount: number;
//   date?: string;
// }
// };

export const useMonthlyStore = defineStore('monthly', {
  state: () => ({
    archivedMonths: {} as Record<string, historyMonthyData>,
  }),

  persist: true,

  getters: {
    // Getter para obtener los datos de un mes específico
    getMonthlyData: (state) => (monthKey: string) => {
      return state.archivedMonths[monthKey] || null; // Devuelve los datos del mes o null si no existe
    },
  },

  actions: {
    initializeMonth() {
      const currentMonth = new Date().toISOString().slice(0, 7);

      console.log('Inicializando mes:', currentMonth);

      if (!this.archivedMonths[currentMonth]) {
        this.archivedMonths[currentMonth] = this.calculateMonthlySummary(currentMonth); // Cambiado para usar la nueva función
        console.log('Nuevo mes creado:', this.archivedMonths[currentMonth]);
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
      const store = useEntriesStore();
      const entries = store.getAllEntries(); // Obtener entradas del store de entradas
      const summary = this.createMonthlySummary(monthKey);

      entries.forEach((entry) => {
        summary.entryCount++;
        if (entry.amount >= 0) {
          summary.income += entry.amount;
        } else {
          summary.expenses += Math.abs(entry.amount);
        }
      });
      summary.monthyBalance = summary.income - summary.expenses; // Calcular balance total
      summary.AllMonthyEntry = entries; // Asignar entradas al resumen mensual

      return summary;
    },

    addMockData() {
      console.log('Agregando datos ficticios');

      // 1. Limpiar datos existentes
      const currentMonth = new Date().toISOString().slice(0, 7);
      this.archivedMonths = {}; // Limpiar meses archivados para la prueba

      // 2. Agregar datos de prueba
      const mockEntries = [
        { id: '1', name: 'Salario', amount: 2500, date: new Date().toISOString() },
        { id: '2', name: 'Alquiler', amount: -800, date: new Date().toISOString() },
        { id: '3', name: 'Supermercado', amount: -350, date: new Date().toISOString() },
      ];

      // 3. Agregar meses anteriores SIN borrar el mes actual
      this.archivedMonths[currentMonth] = this.calculateMonthlySummary(currentMonth); // Crear resumen para el mes actual
      this.archivedMonths[currentMonth].AllMonthyEntry = mockEntries; // Asignar entradas de prueba al mes actual
      this.archivedMonths[currentMonth].entryCount = mockEntries.length; // Contar entradas de prueba
      this.archivedMonths[currentMonth].income = mockEntries.reduce(
        (sum, entry) => (entry.amount > 0 ? sum + entry.amount : sum),
        0,
      ); // Sumar ingresos
      this.archivedMonths[currentMonth].expenses = mockEntries.reduce(
        (sum, entry) => (entry.amount < 0 ? sum + Math.abs(entry.amount) : sum),
        0,
      ); // Sumar gastos
      this.archivedMonths[currentMonth].monthyBalance =
        this.archivedMonths[currentMonth].income - this.archivedMonths[currentMonth].expenses; // Calcular balance total
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMonthlyStore, import.meta.hot));
}
