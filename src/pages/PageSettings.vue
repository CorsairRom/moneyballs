<template>
  <div class="q-pa-md">
    <div class="q-mb-md text-center">
      <div class="text-h4 text-weight-bold">Configuraciones</div>
      <div class="text-subtitle2 text-grey-6">----</div>
    </div>
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title>Configuración Inicial</q-toolbar-title>
    </q-toolbar>

    <q-list bordered padding>
      <q-form @submit="submitInitialSettings">
        <q-item>
          <q-item-section>
            <q-select
              outlined
              v-model="dayEndMonth"
              :options="Array.from({ length: 31 }, (_, i) => i + 1)"
              emit-value
              map-options
              label="Día de cierre de mes"
              :disable="formLocked"
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-input
              outlined
              label="Monto inicial del mes"
              :model-value="salaryFormatted"
              @update:model-value="onSalaryInput"
              @keypress="onlyAllowNumbers"
              type="text"
              :disable="formLocked"
            />
          </q-item-section>
        </q-item>

        <q-btn-group spread class="q-mt-md">
          <q-btn label="Guardar" icon="save" color="primary" type="submit" :disable="formLocked" />
          <q-btn
            label="Configurar"
            icon="settings"
            color="negative"
            @click="toggleForm"
            :disable="!formLocked"
          />
        </q-btn-group>
      </q-form>
    </q-list>
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title>Gastos Fijos</q-toolbar-title>
      <q-btn flat round dense icon="add" @click="showAddExpenseDialog = true" />
    </q-toolbar>

    <q-list bordered padding>
      <q-item v-for="expense in fixedExpenses" :key="expense.id">
        <q-item-section>
          <q-item-label>{{ expense.name }}</q-item-label>
          <q-item-label caption>
            {{ useCurrencify(expense.amount) }} -
            {{ getDurationLabel(expense.duration) }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            round
            dense
            icon="delete"
            color="negative"
            @click="deleteExpense(expense.id)"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Dialog para agregar gasto fijo -->
    <q-dialog v-model="showAddExpenseDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Agregar Gasto Fijo</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="newExpense.name" label="Nombre" dense />
          <q-input v-model="newExpense.amount" label="Monto" type="number" dense class="q-mt-sm" />
          <q-select
            v-model="newExpense.duration"
            :options="durationOptions"
            label="Duración"
            dense
            class="q-mt-sm"
            emit-value
            map-options
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Agregar" color="primary" @click="addExpense" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { uid } from 'quasar';
import { useSettingStore } from 'src/stores/settingStore';
import { useCurrencify } from 'src/use/useCurrencify';
import type { FixedExpense, DurationType } from 'src/models/fixedExpenseModel';

const settingStore = useSettingStore();

const dayEndMonth = ref<number | undefined>();
const salaryInitial = ref<number | undefined>();

const salaryFormatted = computed(() => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(salaryInitial.value || 0);
});

function onSalaryInput(value: string | number | null) {
  const clean = String(value ?? '').replace(/\D/g, '');
  salaryInitial.value = Number(clean || '0');
}

function onlyAllowNumbers(e: KeyboardEvent) {
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
  if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
}

function submitInitialSettings() {
  if (dayEndMonth.value == null || salaryInitial.value == null) {
    console.warn('[Configuración] Día o monto no definidos');
    return;
  }

  settingStore.updateSettings({
    dayEndMonth: dayEndMonth.value,
    initialSalary: salaryInitial.value,
  });

  formLocked.value = true;
}

const formLocked = ref(false);
function toggleForm() {
  formLocked.value = false;
}

onMounted(() => {
  dayEndMonth.value = settingStore.getDayEndMonth;
  salaryInitial.value = settingStore.getInitialSalary;
  formLocked.value = true;
});

// También podrías usar watchEffect para autoactualizar en tiempo real:
// watchEffect(() => {
//   if (!formLocked.value && dayEndMonth.value != null && salaryInitial.value != null) {
//     settingStore.updateSettings({
//       dayEndMonth: dayEndMonth.value,
//       initialSalary: salaryInitial.value,
//     });
//   }
// });

const showAddExpenseDialog = ref(false);
const fixedExpenses = ref<FixedExpense[]>([]);

const durationOptions = [
  { label: 'Permanente', value: 'fixed' },
  { label: '1 mes', value: '1' },
  { label: '3 meses', value: '3' },
  { label: '6 meses', value: '6' },
] as const;

const newExpense = ref({
  name: '',
  amount: 0,
  duration: 'fixed' as DurationType,
});

const getDurationLabel = (duration: DurationType): string => {
  switch (duration) {
    case 'fixed':
      return 'Permanente';
    case '1':
      return '1 mes';
    case '3':
      return '3 meses';
    case '6':
      return '6 meses';
    default:
      return '';
  }
};

function addExpense() {
  if (!newExpense.value.name || !newExpense.value.amount) return;

  // Usamos directamente el valor de duration ya que siempre es string
  const durationValue = newExpense.value.duration;

  fixedExpenses.value.push({
    id: uid(),
    name: newExpense.value.name,
    amount: newExpense.value.amount,
    duration: durationValue,
    startDate: new Date().toISOString(),
  });

  // Limpiar formulario
  newExpense.value = {
    name: '',
    amount: 0,
    duration: 'fixed',
  };
}

function deleteExpense(id: string) {
  fixedExpenses.value = fixedExpenses.value.filter((expense) => expense.id !== id);
}
</script>
