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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSettingStore } from 'src/stores/settingStore';

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
</script>
