<template>
  <div class="avatar">
    <img :src="avatarSrc" alt="" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
interface pageData {
  flag: boolean
  src: string
}

const _data = ref<pageData>({
  flag: false,
  src: '',
})

const avatarSrc = computed((): string => {
  return _data.value.src ? _data.value.src : 'https://s2.loli.net/2022/07/07/pn5x6EK7WzaAPGy.png'
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
