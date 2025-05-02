<template>
  <q-item
    clickable
    tag="a"
    :to="link"
    class="text-white"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface NavLinkProps {
  title: string;
  link?: string;
  icon?: string;
}

withDefaults(defineProps<NavLinkProps>(), {
  link: '#',
  icon: '',
});
</script>
