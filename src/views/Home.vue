
<script lang="ts" setup>
import {ref} from 'vue'
import { ElCard } from 'element-plus'

let modules = ref([{id: 1,icon:'123',name:'test'}])

let navigate = () => {
}

</script>

<template>
  <div class="home">
    <div class="cards">
      <el-card class="card" :body-style="{ padding: 0 }" shadow="hover" :key="item.id" v-for="item in modules">
        <div class="card-item" @click="navigate">
          <i :class="item.icon"></i>
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