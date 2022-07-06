<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ElNotification, ElMessageBox } from 'element-plus'
import { ToolbarNames, Footers } from 'md-editor-v3'
import { dateFormat } from 'src/utils/date'

import { getNotes, getNote, delNote, saveNote, updateNote } from 'src/api/notebook'
import { upload } from 'src/api/common'
import storage from 'src/utils/storage'
const router = useRouter()
const store = useStore()

const footers: Footers[] = ['markdownTotal', '=', 0, 'scrollSwitch']

interface noteItem {
  id: string
  title: string
  time: string
  encryption: string | number
}

const noteList = computed<noteItem[]>(() => {
  let nsfw = pData.value.nsfwVisible
  if (nsfw) return pData.value.noteList
  else
    return pData.value.noteList.filter((o) => {
      return o.encryption !== '1'
    })
})

interface noteBookData {
  nsfwVisible: boolean
  noteListF: noteItem[]
  noteList: noteItem[]
  dialogVisible: boolean
  formData: any
  user: any
  text: string // 转换md值
  currentChoose: noteItem
  encryptionStatus: number
  encryptionFlag: boolean
  toolbarsExclude: ToolbarNames[]
}

let pData = ref<noteBookData>({
  noteListF: [],
  noteList: [],
  nsfwVisible: false,
  dialogVisible: false,
  formData: {},
  user: {},
  text: '',
  encryptionStatus: 0,
  encryptionFlag: false,
  currentChoose: <noteItem>{},
  toolbarsExclude: ['github'],
})

onMounted(async () => {
  let user = store.state.user //storage.get("user")
  pData.value.user = user
  getNoteList()
})

const nsfw = () => {
  pData.value.nsfwVisible = !pData.value.nsfwVisible
}
const back = () => {
  router.push({ name: 'Home' })
}
const cancel = () => {
  pData.value.dialogVisible = false
  pData.value.formData = {
    name: '',
    secret: false,
    encryption: false,
  }
}

const getNoteList = async () => {
  let params = {
    uid: pData.value.user.id,
  }
  let { data } = await getNotes(params)
  pData.value.noteList = data
}

const save = () => {
  pData.value.formData.name = pData.value.currentChoose.id ? pData.value.currentChoose.title : '未命名'
  pData.value.dialogVisible = true
}

interface saveModel {
  title: string
  text: string
  time: string
  uid: null | string
  encryption: number | string
  id: undefined | string | null
}
const submitSave = () => {
  let text = pData.value.text
  text = text.replace(/\n/g, '<br/>') // 解决\n存入数据库中再取出不显示问题

  let data: saveModel = {
    title: pData.value.formData.name,
    text: pData.value.text,
    time: dateFormat(new Date()),
    uid: null,
    encryption: 0,
    id: undefined,
  }

  // 判断是否加密/私密
  if (pData.value.formData.secret) data.uid = storage.get('user').id
  else data.uid = null
  if (pData.value.formData.encryption) data.encryption = 1
  else data.encryption = 0

  if (pData.value.currentChoose.id) {
    // 编辑
    data.id = pData.value.currentChoose.id
    submitEdit(data)
  } else {
    data.id = undefined
    //新增
    subSave(data)
  }
}

const submitEdit = async (params: any) => {
  let { code, data } = await updateNote(params)
  getNoteList()
  if (code == 200) {
    ElNotification.success({
      title: '消息',
      message: '编辑成功',
    })
  }
  cancel()
}

const subSave = async (params: any) => {
  let { code, data } = await saveNote(params)
  getNoteList()
  if (code == 200) {
    ElNotification.success({
      title: '消息',
      message: '保存成功',
    })
    pData.value.currentChoose = data
  }
  cancel()
}

const handleDelete = () => {
  ElMessageBox.confirm(`此操作将永久删除笔记《${pData.value.currentChoose.title}》, 是否继续?`, '删除笔记', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      submitDelete()
    })
    .catch(() => {})
}

const submitDelete = async () => {
  let data = await delNote(pData.value.currentChoose.id)
  ElNotification.success({
    title: '消息',
    message: '删除成功',
  })
  pData.value.currentChoose = {
    id: '',
    title: '',
    time: '',
    encryption: 0,
  }
  pData.value.text = ''
  getNoteList()
}

const getNoteDetail = async () => {
  if (!pData.value.currentChoose) return

  let { data } = await getNote(pData.value.currentChoose.id)
  if (data.encryption == 1 && pData.value.encryptionStatus == 0) {
    pData.value.encryptionFlag = true
  } else {
    pData.value.text = data.text.replace(/<br\/>/g, '\n')
    pData.value.formData.encryption = data.encryption == 1
    pData.value.formData.secret = !!data.uid
  }
}

const chooseItem = (note: noteItem) => {
  pData.value.text = ''
  pData.value.currentChoose = note
  getNoteDetail()
}

const onUploadImg = async (files: Array<File>, callback) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData()
        form.append('file', file)

        upload(form)
          .then((res) => rev(res))
          .catch((error) => rej(error))
      })
    })
  )
  console.log(res);
  callback(res.map((item) => item.data.url))
}
</script>

<template>
  <div class="notebook">
    <!-- 列表区 -->
    <div class="left-list">
      <div class="left-top">
        <div class="tp-btn">
          <span class="back" @click="back">
            <el-icon :size="18"><ArrowLeft /></el-icon>
            <span>返回</span></span
          >
          <div class="icons">
            <span @click="getNoteList" class="icon-refresh">
              <el-icon :size="18"><RefreshRight /></el-icon>
            </span>
            <span class="nsfw" @click="nsfw">
              <el-icon :size="18">
                <template v-if="pData.nsfwVisible">
                  <StarFilled />
                </template>
                <template v-else>
                  <Star />
                </template>
              </el-icon>
            </span>
          </div>
        </div>
        <p>笔记</p>
      </div>
      <div class="note-items">
        <div @click="chooseItem(note)" v-for="note in noteList" :v-id="note.id" :v-title="note.title" class="note-item">
          <p class="_title">{{ note.title || '未命名' }}</p>
          <p class="_time">{{ dateFormat(note.time) }}</p>
        </div>
      </div>
    </div>

    <!-- 编辑区 -->
    <div class="right-editor">
      <md-editor
        @onSave="save"
        :footers="footers"
        @onUploadImg="onUploadImg"
        :toolbarsExclude="pData.toolbarsExclude"
        v-model="pData.text"
      >
        <template #defFooters>
          <span v-show="pData.currentChoose.id" @click="handleDelete" class="footer-delete">
            <el-icon :size="14"><Delete /></el-icon>
          </span>
        </template>
      </md-editor>
    </div>

    <!-- 弹窗 -->
    <el-dialog title="保存" width="420px" top="37vh" v-model="pData.dialogVisible">
      <el-form :model="pData.formData">
        <el-form-item label="输入笔记名称" label-width="140px">
          <el-input v-model="pData.formData.name"></el-input>
        </el-form-item>
        <el-form-item v-if="pData.user.id" label="私密保存" label-width="140px">
          <el-switch v-model="pData.formData.secret"></el-switch>
          <el-tooltip
            class="item"
            effect="dark"
            content="私密保存将会关联账号，其他人无法编辑查看；非私密保存为共享笔记。"
            placement="right"
          >
            <el-icon :size="18"><QuestionFilled class="question" /></el-icon>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="pData.user.id" label="加密保存" label-width="140px">
          <el-switch v-model="pData.formData.encryption"></el-switch>
          <el-tooltip
            class="item"
            effect="dark"
            content="加密保存为账户独有内容，且需要额外独立密码验证通过之后才可查看访问。"
            placement="right"
          >
            <el-icon :size="18"><QuestionFilled class="question" /></el-icon>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitSave">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 验证独立密码 -->
    <!-- <encryption
      v-if="encryptionFlag"
      @close="closeEncryption"
      :visible="encryptionFlag"
      @validSuccess="validSuccess"
    ></encryption> -->

    <!-- 右键菜单 -->
  </div>
</template>

<style lang="scss" scoped>
@import './notebookEdit.scss';
</style>
