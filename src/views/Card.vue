<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-card class="card" :body-style="{ padding: 0 }" shadow="hover" :key="item.id">
    <div class="card-item" @click="$emit('navigate', item)">
      <el-icon><component :is="item.icon" /></el-icon>
      <span>{{ item.name }}</span>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue'

const props = defineProps<{
  item: {
    id: string
    icon: string
    name: string
    order: number
    routeName: string
  }
}>()

const item = ref(props.item)
</script>

<style lang="scss">
.card {
  width: 200px;
  margin-right: 10px;
  cursor: pointer;
  text-align: center;
  color: #1d1d1d;
  .card-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  &:last-child {
    margin-right: 0;
  }
  i {
    font-size: 40px;
    display: block;
    margin-bottom: 10px;
  }
}
</style>
