import { defineStore } from 'pinia';
import type { Entry } from 'src/models/entryModels';
import { acceptHMRUpdate } from 'pinia';
import { useEntriesStore } from 'src/stores/example-store';
import mockData from 'src/models/mockData.json'; // Asegúrate de que la ruta sea correcta

const store = useEntriesStore();
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
      const currentDate = new Date();

      // Verificar si es el último día del mes
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      ).getDate();
      if (currentDate.getDate() === lastDayOfMonth) {
        this.archiveCurrentMonth(currentMonth);
      }

      console.log('Inicializando mes:', currentMonth);

      if (!this.archivedMonths[currentMonth]) {
        this.archivedMonths[currentMonth] = this.calculateMonthlySummary(currentMonth); // Cambiado para usar la nueva función
        console.log('Nuevo mes creado:', this.archivedMonths[currentMonth]);
      }
    },
    archiveCurrentMonth(monthKey: string) {
      const entries = store.getAllEntries(); // Obtener todas las entradas del store de entradas
      if (entries.length > 0) {
        this.archivedMonths[monthKey] = this.calculateMonthlySummary(monthKey); // Crear resumen para el mes actual
        this.archivedMonths[monthKey].AllMonthyEntry = entries; // Asignar entradas al resumen mensual
        this.archivedMonths[monthKey].entryCount = entries.length; // Contar entradas
        this.archivedMonths[monthKey].income = entries.reduce(
          (sum, entry) => (entry.amount > 0 ? sum + entry.amount : sum),
          0,
        ); // Sumar ingresos
        this.archivedMonths[monthKey].expenses = entries.reduce(
          (sum, entry) => (entry.amount < 0 ? sum + Math.abs(entry.amount) : sum),
          0,
        ); // Sumar gastos
        this.archivedMonths[monthKey].monthyBalance =
          this.archivedMonths[monthKey].income - this.archivedMonths[monthKey].expenses; // Calcular balance total
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

      console.log('Income:', summary.income);
      console.log('Expenses:', summary.expenses);
      console.log('Balance:', summary.monthyBalance);

      return summary;
    },

    addMockData() {
      console.log('Agregando datos ficticios');

      // Limpiar datos existentes
      this.archivedMonths = {}; // Limpiar meses archivados para la prueba

      // Cargar datos de prueba desde el archivo JSON
      mockData.forEach((month) => {
        const monthKey = month.monthKey;
        const entries = month.entries;

        // Crear resumen para el mes
        this.archivedMonths[monthKey] = this.calculateMonthlySummary(monthKey);
        this.archivedMonths[monthKey].AllMonthyEntry = entries; // Asignar entradas de prueba al mes
        this.archivedMonths[monthKey].entryCount = entries.length; // Contar entradas de prueba
        this.archivedMonths[monthKey].income = entries.reduce(
          (sum, entry) => (entry.amount > 0 ? sum + entry.amount : sum),
          0,
        ); // Sumar ingresos
        this.archivedMonths[monthKey].expenses = entries.reduce(
          (sum, entry) => (entry.amount < 0 ? sum + Math.abs(entry.amount) : sum),
          0,
        ); // Sumar gastos
        this.archivedMonths[monthKey].monthyBalance =
          this.archivedMonths[monthKey].income - this.archivedMonths[monthKey].expenses; // Calcular balance total
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMonthlyStore, import.meta.hot));
}
