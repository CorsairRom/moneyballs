<template>
  <div class="text-center q-pa-md">
    <q-icon :name="icon" :size="iconSize" :color="iconColor" />
    <div class="text-h6 text-grey-6 q-mt-md">{{ title }}</div>
    <div class="text-subtitle2 text-grey-5">
      {{ subtitle }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: 'account_balance_wallet',
  },
  iconSize: {
    type: String,
    default: '4rem',
  },
  iconColor: {
    type: String,
    default: 'grey-5',
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
});
</script>
