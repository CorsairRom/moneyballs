<template>
  <q-layout view="hHh lpR lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div class="absolute-center">
            <q-icon name="savings" />
            AntStop
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-primary"
      :width="250"
      :breakpoint="767"
    >
      <q-list>
        <q-item-label class="text-white" header> Menus </q-item-label>

        <NavLink v-for="link in navLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavLink, { type NavLinkProps } from 'components/nav/NavLink.vue';

const navLinks: NavLinkProps[] = [
  {
    title: 'Entradas',
    icon: 'point_of_sale',
    link: '/',
  },
  {
    title: 'Configuraciones',
    icon: 'settings',
    link: '/settings',
  },
  {
    title: 'Historial',
    icon: 'history',
    link: '/history',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
