<template>
  <q-page>
    <div class="q-pa-md">
      <q-list bordered padding separator>
        <q-slide-item
          @right="onEntrySlideRight($event, entry)"
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
      <q-form @submit="onAddEntry" class="row q-px-sm q-pb-sm q-col-gutter-sm bg-primary">
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

const $q = useQuasar();

// store
const entriesStore = useEntriesStore();

// reactive list from store
const localEntries = computed(() => entriesStore.entries);

const nameRef = ref<HTMLInputElement | null>(null);

// balance
const balance = computed(() => {
  return localEntries.value.reduce((acc, entry) => acc + entry.amount, 0);
});

// form
const addEntryDefault = {
  name: '',
  amount: 0,
};

const addEntryForm = reactive({
  ...addEntryDefault,
});

const resetAddEntryForm = () => {
  Object.assign(addEntryForm, addEntryDefault);
  if (nameRef.value) {
    nameRef.value.focus();
  }
};

const onAddEntry = () => {
  const newEntry = {
    id: uid(),
    name: addEntryForm.name,
    amount: addEntryForm.amount,
  };

  entriesStore.addEntry(newEntry);
  resetAddEntryForm();
};

interface Entry {
  id: string;
  name: string;
  amount: number;
}

const onEntrySlideRight = (
  {
    reset,
  }: {
    reset: () => void;
  },
  entry: Entry,
) => {
  $q.dialog({
    title: 'Eliminar gasto',
    message: `
      ¿Está seguro de eliminar este gasto?
      <div class="q-mt-md text-weight-bold ${useAmountColorClass(entry.amount)}">
        ${entry.name} : ${useCurrencify(entry.amount)}
      </div>
    `,
    persistent: true,
    html: true,
    ok: {
      label: 'Eliminar',
      color: 'negative',
      noCaps: true,
    },
    cancel: {
      label: 'Cancelar',
      color: 'primary',
      noCaps: true,
    },
  })
    .onOk(() => {
      deleteEntry(entry.id);
      reset();
    })
    .onCancel(() => {
      reset();
    });

  const deleteEntry = (entryID: string) => {
    entriesStore.entries = entriesStore.entries.filter((e) => e.id !== entryID);
    $q.notify({
      type: 'negative',
      message: `Gasto eliminado`,
      timeout: 2000,
    });
  };
};
</script>
