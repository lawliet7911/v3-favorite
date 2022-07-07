<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { menuList } from 'src/api/menu'

const router = useRouter()

interface menuItem {
  id: string
  icon: string
  name: string
  order: number
  routeName: string
}
let menus = ref<any[]>([])

onMounted(async () => {
  let { data } = await menuList({})
  menus.value = data
})

let handleNavigate = (item: menuItem, evt: any) => {
  router.push({ name: item.routeName })
}
</script>

<template>
  <div class="home">
    <div class="cards">
      <el-card class="card" :body-style="{ padding: 0 }" shadow="hover" :key="item.id" v-for="item in menus">
        <div class="card-item" @click="handleNavigate(item, $event)">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.name }}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss">
.home {
  width: 100%;
  height: 100%;
  .cards {
    height: 100%;
    display: flex;
    vertical-align: center;
    align-items: center;
    justify-content: center;
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
  }
}
</style>
