<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Router, useRouter } from 'vue-router'
import { menuList } from 'src/api/menu'
import Card from './Card.vue'

interface menuItem {
  id: string
  icon: string
  name: string
  order: number
  routeName: string
}

let menus = ref<any[]>([])
onMounted(async (): Promise<void> => {
  let { data } = await menuList()
  menus.value = data
})

const router: Router = useRouter()
const handleNavigate = (item: menuItem): void => {
  router.push({ name: item.routeName })
}
</script>

<template>
  <div class="home">
    <div class="cards">
      <Card
        class="card"
        :item="item"
        :key="item.id"
        v-for="item in menus"
        @navigate="handleNavigate"
      />
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
  }
}
</style>
