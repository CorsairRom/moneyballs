<template>
  <q-page>
    <div class="q-pa-md">
      <q-list bordered padding separator>
        <q-slide-item
          @right="handleSwipeToDelete($event, entry)"
          v-for="entry in localEntries"
          :key="entry.id"
          left-color="positive"
          right-color="negative"
        >
          <template v-slot:right>
            <q-icon name="delete" />
          </template>

          <q-item>
            <q-item-section class="text-weight-bold" :class="useAmountColorClass(entry.amount)">
              {{ entry.name }}
            </q-item-section>

            <q-item-section
              side
              class="text-weight-bold"
              :class="useAmountColorClass(entry.amount)"
            >
              {{ useCurrencify(entry.amount) }}
            </q-item-section>
          </q-item>
        </q-slide-item>
      </q-list>
    </div>
    <q-footer class="bg-transparent">
      <div class="row q-mb-sm q-px-md q-py-sm shadow-up-3">
        <div class="col text-grey-7 text-h6">Balance:</div>
        <div :class="useAmountColorClass(balance)" class="col text-h6 text-right">
          {{ useCurrencify(balance) }}
        </div>
      </div>
      <q-form @submit="handleAddEntry" class="row q-px-sm q-pb-sm q-col-gutter-sm bg-primary">
        <div class="col">
          <q-input
            placeholder="Nombre del gasto"
            bg-color="white"
            outlined
            dense
            v-model="addEntryForm.name"
            ref="nameRef"
          />
        </div>
        <div class="col">
          <q-input
            outlined
            bg-color="white"
            placeholder="Monto"
            dense
            input-class="text-right"
            type="number"
            clearable
            :model-value="addEntryForm.amount?.toString() || ''"
            @update:model-value="(val) => (addEntryForm.amount = val ? Number(val) : undefined)"
            :rules="[(val) => (val !== undefined && !isNaN(val)) || 'Ingrese un monto válido']"
          />
        </div>
        <div class="col">
          <q-btn type="submit" round color="primary" icon="add" />
        </div>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useCurrencify } from 'src/use/useCurrencify';
import { useAmountColorClass } from 'src/use/useAmountColorClass';
import { useNotifications } from 'src/use/useNotifications';
import { useDialogs } from 'src/use/useDialogs';

import { uid } from 'quasar';
import { useEntriesStore } from 'src/stores/example-store';
import type { Entry } from 'src/models/entryModels';

// 1. Imports y config inicial
const entriesStore = useEntriesStore();
const nameRef = ref<HTMLInputElement | null>(null);
const { showNotification } = useNotifications();
const { showDialog } = useDialogs();
// 2. Estado reactivo
const addEntryForm = reactive({
  name: '',
  amount: undefined as number | undefined,
});

// 3. Computados
const localEntries = computed(() => entriesStore.entries);
const balance = computed(() => localEntries.value.reduce((acc, entry) => acc + entry.amount, 0));

// 4. Métodos del formulario
const resetAddEntryForm = () => {
  addEntryForm.name = '';
  addEntryForm.amount = undefined;
  nameRef.value?.focus();
};

const handleAddEntry = () => {
  if (!addEntryForm.name || addEntryForm.amount === undefined || isNaN(addEntryForm.amount)) {
    showNotification({
      type: 'warning',
      message: 'Complete todos los campos correctamente',
      timeout: 2000,
    });
    return;
  }

  entriesStore.addEntry({
    id: uid(),
    name: addEntryForm.name,
    amount: addEntryForm.amount,
  });
  resetAddEntryForm();
};

// 5. Manejo de eliminación

const handleDeleteEntry = (entryId: string) => {
  entriesStore.entries = entriesStore.entries.filter((e) => e.id !== entryId);
  showDeleteNotification();
};

const handleSwipeToDelete = ({ reset }: { reset: () => void }, entry: Entry) => {
  showDialog({
    type: 'confirmation',
    title: 'Eliminar gasto',
    message: '¿Está seguro de eliminar este gasto?',
    entry: entry,
  })
    .onOk(() => {
      handleDeleteEntry(entry.id);
      reset();
    })
    .onCancel(reset);
};
// 6. Helpers y configuraciones
const showDeleteNotification = () => {
  showNotification({
    type: 'error',
    message: 'Gasto eliminado',
    timeout: 2000,
  });
};
</script>
