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
            v-model.number="addEntryForm.amount"
            placeholder="Monto"
            dense
            input-class="text-right"
            type="number"
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
import { uid, useQuasar } from 'quasar';
import { useEntriesStore } from 'src/stores/example-store';

// 1. Imports y config inicial
const $q = useQuasar();
const entriesStore = useEntriesStore();
const nameRef = ref<HTMLInputElement | null>(null);

// 2. Estado reactivo
const addEntryForm = reactive({
  name: '',
  amount: 0,
});

// 3. Computados
const localEntries = computed(() => entriesStore.entries);
const balance = computed(() => localEntries.value.reduce((acc, entry) => acc + entry.amount, 0));

// 4. Métodos del formulario
const resetAddEntryForm = () => {
  Object.assign(addEntryForm, { name: '', amount: 0 });
  nameRef.value?.focus();
};

const handleAddEntry = () => {
  entriesStore.addEntry({
    id: uid(),
    name: addEntryForm.name,
    amount: addEntryForm.amount,
  });
  resetAddEntryForm();
};

// 5. Manejo de eliminación
const showDeleteConfirmation = (entry: Entry) => {
  return $q.dialog({
    title: 'Eliminar gasto',
    message: createDeleteMessage(entry),
    persistent: true,
    html: true,
    ok: deleteButtonConfig,
    cancel: cancelButtonConfig,
  });
};

const handleDeleteEntry = (entryId: string) => {
  entriesStore.entries = entriesStore.entries.filter((e) => e.id !== entryId);
  showDeleteNotification();
};

const handleSwipeToDelete = ({ reset }: { reset: () => void }, entry: Entry) => {
  showDeleteConfirmation(entry)
    .onOk(() => {
      handleDeleteEntry(entry.id);
      reset();
    })
    .onCancel(reset);
};

// 6. Helpers y configuraciones
const deleteButtonConfig = {
  label: 'Eliminar',
  color: 'negative',
  noCaps: true,
};

const cancelButtonConfig = {
  label: 'Cancelar',
  color: 'primary',
  noCaps: true,
};

const createDeleteMessage = (entry: Entry) => `
  ¿Está seguro de eliminar este gasto?
  <div class="q-mt-md text-weight-bold ${useAmountColorClass(entry.amount)}">
    ${entry.name} : ${useCurrencify(entry.amount)}
  </div>
`;

const showDeleteNotification = () => {
  $q.notify({
    type: 'negative',
    message: 'Gasto eliminado',
    timeout: 2000,
  });
};

// 7. Tipos
interface Entry {
  id: string;
  name: string;
  amount: number;
}
</script>
