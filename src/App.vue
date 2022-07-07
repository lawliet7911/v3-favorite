<script setup lang="ts">
import { useStore } from 'vuex'
import storage from './utils/storage'
let store = useStore()
let user = storage.get('user')
let user_expTime = storage.get('user-expTime')
console.log(user_expTime)
if (user_expTime < new Date().getTime()) {
  storage.remove('user')
  storage.remove('user-expTime')
  store.commit('SET_USER', {})
} else store.commit('SET_USER', user)
</script>

<template>
  <router-view />
  <my-avatar/>
</template>

<style>
#app {
  height: 100vh;
  width: 100vw;
  background: rgba(245, 245, 245, 1);
}
</style>
