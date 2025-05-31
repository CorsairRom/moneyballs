<template>
  <q-input
    outlined
    :label="label"
    :model-value="modelValue ? formattedValue : ''"
    @update:model-value="onInput"
    @keypress="onlyAllowNumbers"
    type="text"
    :disable="disabled"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue?: number | undefined;
  label?: string;
  disabled?: boolean;
  currency?: string;
  locale?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Monto',
  disabled: false,
  currency: 'CLP',
  locale: 'es-CL',
});

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined];
}>();

const formattedValue = computed(() => {
  if (!props.modelValue) return '';
  return new Intl.NumberFormat(props.locale, {
    style: 'currency',
    currency: props.currency,
    maximumFractionDigits: 0,
  }).format(props.modelValue);
});

function onInput(value: string | number | null) {
  const clean = String(value ?? '').replace(/\D/g, '');
  emit('update:modelValue', clean ? Number(clean) : undefined);
}

function onlyAllowNumbers(e: KeyboardEvent) {
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
  if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
}
</script>
