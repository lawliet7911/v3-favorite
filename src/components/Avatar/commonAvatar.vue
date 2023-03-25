<template>
  <div class="avatar">
    <img :src="avatarSrc" alt="" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

interface PageData {
  flag: boolean
  src: string
}

const DEFAULT_AVATAR_URL = 'https://s2.loli.net/2022/07/07/pn5x6EK7WzaAPGy.png'

const pageData = ref<PageData>({
  flag: false,
  src: ''
})

const avatarSrc = computed(() => {
  return pageData.value.src || DEFAULT_AVATAR_URL
})
</script>

<style lang="scss" scoped>
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  position: fixed;
  bottom: 40px;
  right: 20px;
  background-color: #cfcfcf;
  z-index: 9999999;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    user-select: none;
    width: 45px;
    height: 45px;
  }
}
</style>
