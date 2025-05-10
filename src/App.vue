<template>
  <router-view />
</template>

<script setup lang="ts">
import { Capacitor } from '@capacitor/core';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

if (Capacitor.isNativePlatform()) {
  Keyboard.setResizeMode({
    mode: KeyboardResize.Body,
  }).catch((error) => {
    console.error('Error setting keyboard resize mode:', error);
  });
  Keyboard.addListener('keyboardWillShow', () => {
    document.body.classList.add('keyboard-open');
  }).catch((error) => {
    console.error('Error adding keyboardWillShow listener:', error);
  });

  Keyboard.addListener('keyboardWillHide', () => {
    document.body.classList.remove('keyboard-open');
  }).catch((error) => {
    console.error('Error adding keyboardWillHide listener:', error);
  });
}
</script>
