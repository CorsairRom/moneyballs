<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md text-center">
      <div class="text-h4 text-weight-bold">Historial Mensual</div>
      <div class="text-subtitle2 text-grey-6">Lista de gastos por mes</div>
    </div>

    <!-- Verificar si hay datos -->
    <div v-if="sortedMonths.length === 0" class="text-negative">No hay datos disponibles</div>

    <!-- Añadir contenedor para las cards -->
    <div v-else>
      <q-card
        v-for="month in sortedMonths"
        :key="month.monthKey"
        class="q-mb-sm"
        appear
        enter-active-class="animated fadeIn"
        @click="viewMonthDetails(month.monthKey)"
      >
        <q-card-section>
          <div class="row items-center">
            <div class="col">
              <div class="text-h6">
                {{ formatMonth(month.monthKey) }}
                <span class="text-caption text-grey-6">({{ month.monthKey }})</span>
              </div>
              <div class="text-caption">{{ month.entryCount }} transacciones</div>
            </div>
            <div class="col-auto">
              <q-badge :color="balanceColor(month.monthyBalance)" class="q-pa-sm text-bold">
                {{ useCurrencify(month.monthyBalance) }}
              </q-badge>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section horizontal>
          <q-card-section class="col">
            <div class="text-positive text-caption">Ingresos</div>
            <div>{{ useCurrencify(month.income) }}</div>
          </q-card-section>

          <q-separator vertical />

          <q-card-section class="col">
            <div class="text-negative text-caption">Gastos</div>
            <div>{{ useCurrencify(month.expenses) }}</div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useMonthlyStore } from 'src/stores/monthlyStore';
import { useCurrencify } from 'src/use/useCurrencify';
// import { useAmountColorClass } from 'src/use/useAmountColorClass';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const store = useMonthlyStore();
const router = useRouter();

// Inicializar el store al montar el componente
// store.initializeMonth();

// Condición corregida para detectar falta de datos
if (Object.keys(store.archivedMonths).length < 2) {
  console.warn('Cargando datos de prueba...');
  store.addMockData();
}

// Obtener el mes actual
// const currentMonth = new Date().toISOString().slice(0, 7);

// Obtener datos del mes actual usando el nuevo getter
// const monthlyData = computed(() => store.getMonthlyData(currentMonth));

// Obtener meses ordenados
const sortedMonths = computed(() =>
  Object.values(store.archivedMonths).sort((a, b) => b.monthKey.localeCompare(a.monthKey)),
);

const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  if (!year || !month) return '';
  return new Date(Date.UTC(+year, +month, 1))
    .toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
    })
    .toUpperCase();
};

const balanceColor = (balance: number) => (balance >= 0 ? 'positive' : 'negative');

const viewMonthDetails = async (monthKey: string) => {
  await router.push(`/history/${monthKey}`);
};
</script>
