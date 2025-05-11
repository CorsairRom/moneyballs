<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Historial Mensual</div>

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
              <q-badge :color="balanceColor(month.balance)" class="q-pa-sm text-bold">
                {{ useCurrencify(month.balance) }}
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
// import { useRouter } from 'vue-router';

const store = useMonthlyStore();
// const router = useRouter();

// Inicializar el store al montar el componente
store.initializeMonth();

// Condición corregida para detectar falta de datos
if (Object.keys(store.archivedMonths).length < 2) {
  // Si hay menos de 2 meses
  console.warn('Cargando datos de prueba...');
  store.addMockData();
}

const sortedMonths = computed(() =>
  Object.values(store.archivedMonths).sort((a, b) => b.monthKey.localeCompare(a.monthKey)),
);

const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  return new Date(`${year}-${month}-01`)
    .toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
    })
    .toUpperCase();
};

const balanceColor = (balance: number) => (balance >= 0 ? 'positive' : 'negative');

// const viewMonthDetails = (monthKey: string) => {
//   router.push(`/history/${monthKey}`);
// };
</script>
