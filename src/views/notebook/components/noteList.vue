<template>
  <div class="note-items" v-loading="_data.listLoading">
    <div
      @mouseenter="itemEnter(note)"
      @mouseleave="itemLeave(note)"
      @click="chooseItem(note)"
      v-for="note in noteList"
      :v-id="note.id"
      :key="note.id"
      :v-title="note.title"
      class="note-item"
    >
      <el-icon @click.stop="itemDel(note)" v-if="note.delVisible" class="note-delete" :size="14">
        <Close />
      </el-icon>
      <el-icon
        @click.stop="handleCollectClick(note)"
        v-if="note.delVisible"
        class="note-collect"
        :size="14"
      >
        <Star />
      </el-icon>
      <p :title="note.title" class="_title">{{ note.title || '未命名' }}</p>
      <p class="_time">{{ dateFormat(note.time) }}</p>
    </div>
  </div>

  <el-dialog title="收藏" width="420px" top="37vh" v-model="collectionVisible">
    <el-form :model="collectForm">
      <el-form-item label="收藏夹" label-width="80px">
        <el-select v-model="collectForm.cid" placeholder="请选择收藏夹">
          <el-option label="默认" value="-1">默认</el-option>
          <el-option
            v-for="collect in collectList"
            :key="collect.id"
            :label="collect.name"
            :value="collect.id"
          ></el-option>
        </el-select>
        <el-button class="add-collection-button" @click="addNewVisible = true">新增</el-button>
      </el-form-item>
      <template v-if="addNewVisible">
        <h2>新增</h2>
        <el-form-item label="名称" label-width="80px">
          <el-input
            class="add-collection-new-input"
            placeholder="收藏夹名"
            v-model="collectForm.newName"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="80px">
          <el-input
            class="add-collection-new-input"
            placeholder="收藏夹描述"
            v-model="collectForm.description"
          ></el-input>
        </el-form-item>

        <el-form-item label="私密" label-width="80px">
          <el-switch v-model="collectForm.secret"></el-switch>
        </el-form-item>

        <el-button class="add-collection-button" type="primary" @click="addNewCollection"
          >保 存</el-button
        >
      </template>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="cancelSave">取 消</el-button>
        <el-button type="primary" @click="submitSave">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessageBox, ElNotification } from 'element-plus'
import { delNote, getNoteByCollection, getNotes } from 'src/api/notebook'
import { useUserState } from 'src/store'
import { favorite, getCollection, saveCollection } from 'src/api/collection'
import { dateFormat } from 'src/utils/date'
import { computed, onMounted, ref } from 'vue'
import { collectionItem, noteItem } from '../types'
const emit = defineEmits(['choose'])

const userState = useUserState()
interface NoteListProps {
  cid?: string
  nsfw?: boolean
}

const props = withDefaults(defineProps<NoteListProps>(), {
  cid: ''
})

const itemEnter = (note: noteItem) => {
  note.delVisible = true
}

const itemLeave = (note: noteItem) => {
  note.delVisible = false
}

const noteListRef = ref<noteItem[]>([])

const noteList = computed<noteItem[]>(() => {
  let nsfw = props.nsfw
  if (nsfw) return noteListRef.value
  else
    return noteListRef.value.filter((o) => {
      return o.encryption !== '1'
    })
})

const _data = ref({
  listLoading: false
})

onMounted(() => {
  getNoteList()
  getCollectionList()
})

const getNoteListParams = () => {
  let params = {
    uid: userState.user?.id,
    cid: props.cid || undefined
  }
  return params
}

const getCollectionList = async () => {
  let { data } = await getCollection({
    uid: userState.user?.id
  })
  collectList.value = data as collectionItem[]
}

const getNoteList = async () => {
  _data.value.listLoading = true
  let params = getNoteListParams()
  let _list = []
  if (params.cid) {
    let { data } = await getNoteByCollection(params.cid)
    _list = data
  } else {
    let { data } = await getNotes(params)
    _list = data
  }
  _data.value.listLoading = false
  noteListRef.value = _list
}

const itemDel = (note: noteItem) => {
  ElMessageBox.confirm(
    `此操作将永久删除笔记《${note.title ? note.title : '未命名'}》, 是否继续?`,
    '删除笔记',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    submitDelete(note.id)
  })
}

const submitDelete = async (id: string) => {
  let did: string = id
  let data = await delNote(did)
  ElNotification.success({
    title: '消息',
    message: '删除成功'
  })
  if (!currentChoose) return
  if (id == currentChoose.id) {
    currentChoose = undefined
    emit('choose')
  }
  getNoteList()
}

let currentChoose: noteItem | undefined
const chooseItem = (note: noteItem) => {
  currentChoose = note
  emit('choose', note)
}

const handleCollectClick = (note: noteItem) => {
  console.log('collect-', note)
  currentChoose = note
  collectionVisible.value = true
}

// 收藏
interface collectFormModel {
  cid: string
  newName: string
  description: string
  secret: '0' | '1'
}
const collectionVisible = ref<boolean>(false)
const collectForm = ref<collectFormModel>({
  cid: '',
  newName: '',
  description: '',
  secret: '0'
})
const collectList = ref<collectionItem[]>([])

const cancelSave = () => {
  currentChoose = undefined
  collectionVisible.value = false
}

const addNewVisible = ref<boolean>(false)

const addNewCollection = async () => {
  let params = {
    name: collectForm.value.newName,
    description: collectForm.value.description,
    secret: collectForm.value.secret,
    uid: userState.user?.id
  }
  let response = await saveCollection(params)
  getCollectionList()
  addNewVisible.value = false
  collectForm.value = {
    cid: '',
    newName: '',
    description: '',
    secret: '0'
  }
}

const submitSave = async () => {
  let params = {
    collectionId: collectForm.value.cid,
    notebookId: currentChoose?.id
  }
  let { data } = await favorite(params)
  ElNotification.success({
    title: '消息',
    message: '收藏成功'
  })
  collectionVisible.value = false
  getNoteList()
}

defineExpose({
  getNoteList,
  itemDel
})
</script>

<style lang="scss" scoped>
@mixin scrollBar {
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 20px;
  }
}

.note-items {
  @include scrollBar();
  overflow-y: scroll;
  height: 100%;
  flex: 1;
  line-height: 1;

  .note-item {
    height: 50px;
    box-sizing: border-box;
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    position: relative;

    @mixin ItemIcon {
      position: absolute;
      top: 6px;
      cursor: pointer;
    }

    .note-delete {
      @include ItemIcon();
      right: 10px;
    }

    .note-collect {
      @include ItemIcon();
      right: 25px;
    }

    &:hover {
      transition: all ease 0.4s;
      background: whitesmoke;
    }

    p {
      margin: 0;
    }

    ._title {
      font-size: 14px;
      max-width: 200px;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: keep-all;
      margin-bottom: 5px;
    }

    ._time {
      font-size: 12px;
      text-align: right;
    }
  }
}
.add-collection-button {
  margin-left: 10px;
}

.add-collection-new-input {
  width: 200px;
}
</style>
