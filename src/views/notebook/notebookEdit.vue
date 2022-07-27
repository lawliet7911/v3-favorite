<template>
  <div class="notebook">
    <!-- 列表区 -->
    <div class="left-list" v-loading="_data.listLoading">
      <div class="left-top">
        <div class="tp-btn">
          <span class="back" @click="back">
            <el-icon :size="18"><ArrowLeft /></el-icon>
            <span>返回</span></span
          >
          <div class="icons">
            <span @click="getNoteList" title="刷新列表" class="icon-refresh">
              <el-icon :size="18"><RefreshRight /></el-icon>
            </span>
            <span @click="newNote" title="新建文档" class="icon-refresh">
              <el-icon :size="18"><DocumentAdd /></el-icon>
            </span>
            <span class="nsfw" @click="nsfw">
              <el-icon :size="18">
                <template v-if="_data.nsfwVisible">
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
        <div
          @mouseenter="itemEnter(note)"
          @mouseleave="itemLeave(note)"
          @click="chooseItem(note)"
          v-for="note in noteList"
          :v-id="note.id"
          :v-title="note.title"
          class="note-item"
        >
          <el-icon @click.stop="itemDel(note)" v-if="note.delVisible" class="note-delete" :size="14"><Close /></el-icon>
          <p class="_title">{{ note.title || '未命名' }}</p>
          <p class="_time">{{ dateFormat(note.time) }}</p>
        </div>
      </div>
    </div>

    <!-- 编辑区 -->
    <div class="right-editor" v-loading="_data.editLoading">
      <md-editor
        @onSave="save"
        :footers="footers"
        @onUploadImg="onUploadImg"
        :toolbarsExclude="_data.toolbarsExclude"
        v-model="_data.text"
      >
        <template #defFooters>
          <span v-show="_data.currentChoose.id" @click="handleDelete" class="footer-delete">
            <el-icon :size="14"><Delete /></el-icon>
          </span>
        </template>
      </md-editor>
    </div>

    <!-- 弹窗 -->
    <el-dialog title="保存" width="420px" top="37vh" v-model="_data.dialogVisible">
      <el-form :model="_data.formData">
        <el-form-item label="输入笔记名称" label-width="140px">
          <el-input v-model="_data.formData.name"></el-input>
        </el-form-item>
        <el-form-item v-if="_data.user.id" label="私密保存" label-width="140px">
          <el-switch v-model="_data.formData.secret"></el-switch>
          <el-tooltip
            class="item"
            effect="dark"
            content="私密保存将会关联账号，其他人无法编辑查看；非私密保存为共享笔记。"
            placement="right"
          >
            <el-icon :size="18"><QuestionFilled class="question" /></el-icon>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="_data.user.id" label="加密保存" label-width="140px">
          <el-switch v-model="_data.formData.encryption"></el-switch>
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
    <encryption
      v-if="_data.encryptionFlag"
      @close="closeEncryption"
      :visible="_data.encryptionFlag"
      @validSuccess="validSuccess"
    ></encryption>

    <!-- 右键菜单 -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ElNotification, ElMessageBox } from 'element-plus'
import { ToolbarNames, Footers } from 'md-editor-v3'
import { dateFormat } from 'src/utils/date'

import { getNotes, getNote, delNote, saveNote, updateNote } from 'src/api/notebook'
import { upload } from 'src/api/common'
import storage from 'src/utils/storage'
import { objectToString } from 'src/utils/common'
import { useUserState } from 'src/store'

const router = useRouter()

const footers: Footers[] = ['markdownTotal', '=', 0, 'scrollSwitch']

interface noteItem {
  id: string
  title: string
  time: string
  encryption: string | number
  delVisible: boolean
}

const noteList = computed<noteItem[]>(() => {
  let nsfw = _d.nsfwVisible
  if (nsfw) return _d.noteList
  else
    return _d.noteList.filter((o) => {
      return o.encryption !== '1'
    })
})

interface noteBookData {
  nsfwVisible: boolean
  noteListF: noteItem[]
  noteList: noteItem[]
  dialogVisible: boolean
  editLoading: boolean
  listLoading: boolean
  formData: any
  user: any
  text: string // 转换md值
  textOrigin: string
  currentChoose: noteItem
  encryptionStatus: number
  encryptionFlag: boolean
  toolbarsExclude: ToolbarNames[]
}

let _data = ref<noteBookData>({
  noteListF: [],
  noteList: [],
  nsfwVisible: false,
  dialogVisible: false,
  editLoading: false,
  listLoading: false,
  formData: {},
  user: {},
  text: '',
  textOrigin: '',
  encryptionStatus: 0,
  encryptionFlag: false,
  currentChoose: <noteItem>{},
  toolbarsExclude: ['github'],
})

const _d = _data.value

const userState = useUserState()
onMounted(async () => {
  let user = userState.user //storage.get("user")
  _d.user = user
  getNoteList()
})

const nsfw = () => {
  _d.nsfwVisible = !_d.nsfwVisible
}
const back = () => {
  router.push({ name: 'Home' })
}
const cancel = () => {
  _d.dialogVisible = false
  _d.formData = {
    name: '',
    secret: false,
    encryption: false,
  }
}

const getNoteList = async () => {
  _d.listLoading = true
  let params = {
    uid: _d.user.id,
  }
  let { data } = await getNotes(params)
  _d.listLoading = false
  _d.noteList = data
}

const save = () => {
  _d.formData.name = _d.currentChoose.id ? _d.currentChoose.title : '未命名'
  _d.dialogVisible = true
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
  let text = _d.text
  text = text.replace(/\n/g, '<br/>') // 解决\n存入数据库中再取出不显示问题

  let data: saveModel = {
    title: _d.formData.name,
    text: _d.text,
    time: dateFormat(new Date()),
    uid: null,
    encryption: 0,
    id: undefined,
  }

  // 判断是否加密/私密
  if (_d.formData.secret) data.uid = storage.get('user').id
  else data.uid = null
  if (_d.formData.encryption) data.encryption = 1
  else data.encryption = 0

  if (_d.currentChoose.id) {
    // 编辑
    data.id = _d.currentChoose.id
    return submitEdit(data)
  } else {
    data.id = undefined
    //新增
    return subSave(data)
  }
}

const submitEdit = async (params: any) => {
  let res: any = await updateNote(params)
  getNoteList()
  if (res.code == 200) {
    ElNotification.success({
      title: '消息',
      message: '编辑成功',
    })
    _d.textOrigin = _d.text
  }
  cancel()
  return true
}

const subSave = async (params: any) => {
  let res: any = await saveNote(params)
  getNoteList()
  if (res.code == 200) {
    ElNotification.success({
      title: '消息',
      message: '保存成功',
    })
    _d.currentChoose = res.data
    _d.textOrigin = _d.text
  }
  cancel()
  return true
}

const handleDelete = () => {
  ElMessageBox.confirm(`此操作将永久删除笔记《${_d.currentChoose.title}》, 是否继续?`, '删除笔记', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      submitDelete()
    })
    .catch(() => {})
}

const submitDelete = async (id?: string) => {
  let did: string = id ? id : _d.currentChoose.id
  let data = await delNote(did)
  ElNotification.success({
    title: '消息',
    message: '删除成功',
  })
  if (id == _d.currentChoose.id || !_d.currentChoose.id) {
    _d.currentChoose = {
      id: '',
      title: '',
      time: '',
      encryption: 0,
      delVisible: false,
    }
    _d.text = ''
  }
  getNoteList()
}

const chooseItem = (note: noteItem) => {
  if (_d.textOrigin !== '' && _d.textOrigin !== _d.text) {
    ElMessageBox.confirm(`笔记有修改未保存, 是否离开?`, '提示', {
      confirmButtonText: '保存笔记',
      cancelButtonText: '取消修改',
      type: 'warning',
    })
      .then(async () => {
        await submitSave()
        goAhead()
      })
      .catch(() => {
        goAhead()
      })
    return
  }else if(_d.textOrigin !== '' && note.id === _d.currentChoose.id) {
    return
  }
  function goAhead() {
    _d.text = ''
    _d.currentChoose = note
    getNoteDetail()
  }
  goAhead()
}

const onUploadImg = async (files: Array<File>, callback: Function | any) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData()
        form.append('file', file)
        _d.editLoading = true
        upload(form)
          .then((res) => {
            _d.editLoading = false
            rev(res)
          })
          .catch((error) => {
            _d.editLoading = false
            rej(error)
          })
      })
    })
  )
  callback(res.map((item: any) => item.data.url))
}

const itemEnter = (note: noteItem) => {
  note.delVisible = true
}

const itemLeave = (note: noteItem) => {
  note.delVisible = false
}

const itemDel = (note: noteItem) => {
  ElMessageBox.confirm(`此操作将永久删除笔记《${note.title?note.title:'未命名'}》, 是否继续?`, '删除笔记', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      submitDelete(note.id)
    })
    .catch(() => {})
}

const newNote = (): void => {
  _d.currentChoose = {
    id: '',
    title: '',
    time: '',
    encryption: 0,
    delVisible: false,
  }
  _d.text = ''
}

const closeEncryption = (): void => {
  _d.encryptionFlag = false
}

const validSuccess = (): void => {
  _d.encryptionStatus = 1
  getNoteDetail()
}

const getNoteDetail = async () => {
  if (!_d.currentChoose) return

  _d.editLoading = true
  let { data } = await getNote(_d.currentChoose.id)
  _d.editLoading = false

  if (data.encryption == 1 && _d.encryptionStatus == 0) {
    _d.encryptionFlag = true
  } else {
    _d.text = data.text.replace(/<br\/>/g, '\n')
    _d.textOrigin = _d.text
    _d.formData.encryption = data.encryption == 1
    _d.formData.secret = !!data.uid
  }
}
</script>

<style lang="scss" scoped>
@import './notebookEdit.scss';
</style>
