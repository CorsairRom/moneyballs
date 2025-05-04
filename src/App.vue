<template>
  <router-view />
</template>

<script setup lang="ts">
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

Keyboard.setResizeMode({
  mode: KeyboardResize.Body, // Use the correct enum value for 'body'
}).catch((error) => {
  console.error('Error setting keyboard resize mode:', error);
});
//
</script>
