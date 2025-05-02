<template>
  <q-page>
    <div class="q-pa-md">
      <q-list bordered padding separator>
        <q-slide-item
          @right="
            onEntrySlideRight($event, entry)
          "
          v-for="entry in entries"
          :key="entry.id"
          left-color="positive"
          right-color="negative"
        >
          <template v-slot:right>
            <q-icon name="delete" />
          </template>

          <q-item>
            <q-item-section
              class="text-weight-bold"
              :class="
                useAmountColorClass(entry.amount)
              "
            >
              {{ entry.name }}
            </q-item-section>

            <q-item-section
              side
              class="text-weight-bold"
              :class="
                useAmountColorClass(entry.amount)
              "
            >
              {{ useCurrencify(entry.amount) }}
            </q-item-section>
          </q-item>
        </q-slide-item>
      </q-list>
    </div>
    <q-footer class="bg-transparent">
      <div
        class="row q-mb-sm q-px-md q-py-sm shadow-up-3"
      >
        <div class="col text-grey-7 text-h6">
          Balance:
        </div>
        <div
          :class="useAmountColorClass(balance)"
          class="col text-h6 text-right"
        >
          {{ useCurrencify(balance) }}
        </div>
      </div>
      <q-form
        @submit="onAddEntry"
        class="row q-px-sm q-pb-sm q-col-gutter-sm bg-primary"
      >
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
          <q-btn
            type="submit"
            round
            color="primary"
            icon="add"
          />
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
const $q = useQuasar();
//PENSAR EN PONER FECHAS
const entries = ref([
  {
    id: 'id1',
    name: 'Salary',
    amount: 1657000,
  },
  {
    id: 'id2',
    name: 'Arriendo',
    amount: -2000000,
  },
  {
    id: 'id3',
    name: 'Luz',
    amount: -34500,
  },
  {
    id: 'id4',
    name: 'Agua',
    amount: -23450,
  },
  {
    id: 'id5',
    name: 'Desconocido',
    amount: 0,
  },
]);

const nameRef = ref<HTMLInputElement | null>(
  null,
);
// balance

const balance = computed(() => {
  return entries.value.reduce(
    (acc, entry) => acc + entry.amount,
    0,
  );
});

// entries

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
  entries.value.push({
    id: uid(),
    name: addEntryForm.name,
    amount: addEntryForm.amount,
  });
  resetAddEntryForm();
};
//delete entry
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
      // console.log('OK')
      deleteEntry(entry.id);
      reset();
    })
    .onCancel(() => {
      // console.log('Cancel')
      reset();
    });

  const deleteEntry = (entryID: string) => {
    const index = entries.value.findIndex(
      (e) => e.id === entryID,
    );
    if (index !== -1) {
      entries.value.splice(index, 1);
    }
    $q.notify({
      type: 'negative',
      message: `Gasto eliminado`,
      timeout: 2000,
    });
  };
};
// const onLeft = (entry: any) => {
//   const index = entries.value.findIndex(
//     (e) => e.id === entry.id,
//   );
//   if (index !== -1) {
//     entries.value[index].amount =
//       entries.value[index].amount * -1;
//   }
// };
</script>
