<template>
  <router-view />
</template>

<script setup lang="ts">
// import { Capacitor } from '@capacitor/core';
// import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
// import { useSettingStore } from 'src/stores/settingStore'; // importa el store
// import { useEntriesStore } from 'src/stores/example-store'
import { useMonthlyStore } from 'src/stores/monthlyStore';

const monthlyStore = useMonthlyStore();

// Disparar solo una vez al iniciar la app
monthlyStore.initializeMonth();

// if (Capacitor.isNativePlatform()) {
//   Keyboard.setResizeMode({
//     mode: KeyboardResize.Body,
//   }).catch((error) => {
//     console.error('Error setting keyboard resize mode:', error);
//   });
//   Keyboard.addListener('keyboardWillShow', () => {
//     document.body.classList.add('keyboard-open');
//   }).catch((error) => {
//     console.error('Error adding keyboardWillShow listener:', error);
//   });

//   Keyboard.addListener('keyboardWillHide', () => {
//     document.body.classList.remove('keyboard-open');
//   }).catch((error) => {
//     console.error('Error adding keyboardWillHide listener:', error);
//   });
// }
</script>
