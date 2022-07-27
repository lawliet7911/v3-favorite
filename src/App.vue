<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserState } from './store'
import storage from './utils/storage'
let user = storage.get('user')
let user_expTime = storage.get('user-expTime')
let userState = useUserState()
if (user_expTime < new Date().getTime()) {
  storage.remove('user')
  storage.remove('user-expTime')
  userState.setUser({}, 'app')
} else userState.setUser(user)
</script>

<template>
  <router-view />
  <my-avatar />
</template>

<style>
#app {
  height: 100vh;
  width: 100vw;
  background: rgba(245, 245, 245, 1);
}
</style>
