<template>
  <q-page padding>
    <!-- Título -->
    <div class="q-mb-md text-center">
      <div class="text-h4 text-weight-bold">{{ formattedMonth }}</div>
      <div class="text-subtitle2 text-grey-6">Resumen de entradas y salidas</div>
    </div>

    <!-- Resumen mensual -->
    <q-card class="q-mb-lg bg-grey-1" flat bordered>
      <q-card-section class="text-center">
        <div class="row justify-around">
          <div>
            <div class="text-caption text-grey-6">Ingresos</div>
            <div class="text-h6 text-positive">{{ useCurrencify(monthSummary?.income || 0) }}</div>
          </div>
          <div>
            <div class="text-caption text-grey-6">Gastos</div>
            <div class="text-h6 text-negative">
              {{ useCurrencify(monthSummary?.expenses || 0) }}
            </div>
          </div>
          <div>
            <div class="text-caption text-grey-6">Balance</div>
            <div
              :class="monthSummary!.monthyBalance < 0 ? 'text-negative' : 'text-primary'"
              class="text-h6"
            >
              {{ useCurrencify(monthSummary?.monthyBalance || 0) }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Lista de transacciones -->
    <q-list class="scrollable-list">
      <q-card
        v-for="entry in sortedEntries"
        :key="entry.id"
        class="q-mb-sm"
        flat
        bordered
        style="border-radius: 12px"
      >
        <q-item>
          <q-item-section avatar>
            <q-icon
              :name="entry.amount >= 0 ? 'north_east' : 'south_east'"
              :color="entry.amount >= 0 ? 'positive' : 'negative'"
              size="md"
            />
          </q-item-section>

          <q-item-section>
            <div class="text-h6 text-weight-medium">{{ entry.name }}</div>
            <div class="text-caption text-grey-7">{{ formatDate(entry.date) }}</div>
          </q-item-section>

          <q-item-section side top>
            <div
              :class="entry.amount < 0 ? 'text-negative' : 'text-positive'"
              class="text-subtitle1 text-weight-bold"
            >
              {{ useCurrencify(entry.amount) }}
            </div>
          </q-item-section>
        </q-item>
      </q-card>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMonthlyStore } from 'src/stores/monthlyStore';
import { useCurrencify } from 'src/use/useCurrencify';

const store = useMonthlyStore();
const route = useRoute();

const monthKey = computed(() => route.params.monthKey as string);
const monthSummary = computed(() => store.archivedMonths[monthKey.value]);

const formattedMonth = computed(() => {
  const [year, month] = monthKey.value?.split('-') || [];
  if (!year || !month) return '';
  return new Date(Date.UTC(+year, +month - 1, 1))
    .toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
    })
    .toUpperCase();
});

const sortedEntries = computed(() => {
  return (
    monthSummary.value?.AllMonthyEntry.slice().sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    ) || []
  );
});

const formatDate = (dateString: string) => {
  if (!dateString) return 'Fecha no válida';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha no válida';

  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
</script>

<style scoped>
.scrollable-list {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
