<template>
  <div class="note-collections">
    <el-collapse v-model="activeName" @change="handleCollapseChange" accordion>
      <el-collapse-item
        v-for="collect in collections"
        :accordion="true"
        :key="collect.id"
        :name="collect.id"
      >
        <template #title>
          <div class="collection-title">
            <span :title="collect.name + `: ` + collect.description" class="name">{{
              collect.name
            }}</span>
            <!-- todo 需要新建一个表 tb_user_collection关系表 一对多 -->
            <!-- <p class="summary">总计<span class="num">10</span>篇</p> -->
          </div>
        </template>
        <!-- content -->
        <note-list @choose="chooseItem" v-if="activeName === collect.id" :cid="collect.id" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { getCollection } from 'src/api/collection'
import { useUserState } from 'src/store'
import { onMounted, ref } from 'vue'
import { collectionItem, noteItem } from '../types'
import noteList from './noteList.vue'

const activeName = ref('')
const userState = useUserState()
const _data = ref({})
const collections = ref<collectionItem[]>([])
const emit = defineEmits(['choose'])
onMounted(() => {
  getCollectionList()
})

const getCollectionList = async () => {
  let { data } = await getCollection({
    uid: userState.user?.id
  })
  collections.value = data as collectionItem[]
}

const handleCollapseChange = (activeId: string) => {
  if (!activeId) return
}

const chooseItem = (item: noteItem) => {
  emit('choose', item)
}
</script>

<style lang="scss" scoped>
.note-collections {
  height: 100%;

  :deep(.el-collapse-item__content) {
    padding-bottom: 0;
    max-height: 300px;
  }
  :deep(.collection-title) {
    padding: 0 10px;
    line-height: 1.2;
    .name {
      font-size: 13px;
      width: 170px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: keep-all;
      color: #2c3e50;
    }
    .summary {
      text-align: right;
      .num {
        color: #1bb3fb;
      }
    }
  }
}
</style>
