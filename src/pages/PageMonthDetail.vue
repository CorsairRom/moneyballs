<template>
  <q-page>
    <div class="text-h5 q-mb-md">{{ formattedMonth }}</div>
    <q-list bordered class="scrollable-list">
      <q-item v-for="entry in sortedEntries" :key="entry.id" bordered padding separator>
        <q-item-section>
          <div class="text-h6">{{ entry.name }}</div>
          <div class="text-caption">{{ formatDate(entry.date) }}</div>
        </q-item-section>
        <q-item-section>
          <div :class="entry.amount < 0 ? 'text-negative' : 'text-positive'">
            {{ useCurrencify(entry.amount) }}
          </div>
        </q-item-section>
      </q-item>
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
  return new Date(Date.UTC(+year, +month, 1))
    .toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
    })
    .toUpperCase();
});

// Ordenar las entradas por fecha
const sortedEntries = computed(() => {
  return (
    monthSummary.value?.AllMonthyEntry.slice().sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    ) || []
  );
});

// Formatear la fecha para mostrarla
const formatDate = (dateString: string) => {
  if (!dateString) return 'Fecha no válida';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha no válida';

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: userTimeZone,
  });
};
</script>

<style scoped>
.scrollable-list {
  max-height: 70vh; /* Ajusta la altura máxima según sea necesario */
  overflow-y: auto; /* Habilita el desplazamiento vertical */
}
</style>
