<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import MdEditor from "md-editor-v3"
import "md-editor-v3/lib/style.css"
import { ElNotification } from "element-plus"
import { ToolbarNames } from "md-editor-v3"
import {dateFormat} from 'src/utils/date'

import {
  getNotes,
  getNote,
  delNote,
  saveNote,
  updateNote,
} from "src/api/notebook"
import storage from "src/utils/storage"
const router = useRouter()
const store = useStore()

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
      return o.encryption !== "1"
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
  text: "",
  encryptionStatus: 0,
  encryptionFlag: false,
  currentChoose: <noteItem>{},
  toolbarsExclude: ["github"],
})

onMounted(async () => {
  let user = store.state.user //storage.get("user")
  pData.value.user = user
  getData()
})

const nsfw = () => {
  pData.value.nsfwVisible = !pData.value.nsfwVisible
}
const back = () => {
  router.push({ name: "Home" })
}
const cancel = () => {
  pData.value.dialogVisible = false
  pData.value.formData = {
    name: "",
    secret: false,
    encryption: false,
  }
}

const getData = async () => {
  let params = {
    uid: pData.value.user.id,
  }
  let { data } = await getNotes(params)
  pData.value.noteList = data
}

const submitSave = () => {
  let text = pData.value.text
  text = text.replace(/\n/g, "<br/>") // 解决\n存入数据库中再取出不显示问题

  interface saveModel {
    title: string,
    text: string,
    time: string,
    uid: null | string,
    encryption: number |string,
    id: undefined | string | null
  }

  let data:saveModel = {
    title: pData.value.formData.name,
    text: pData.value.text,
    time: dateFormat(new Date()),
    uid: null,
    encryption: 0,
    id: undefined
  }

  // 判断是否加密/私密
  if (pData.value.formData.secret) data.uid = storage.get("user").id
  else data.uid = null
  if (pData.value.formData.encryption) data.encryption = 1
  else data.encryption = 0

  if (pData.value.currentChoose.id) {
    // 编辑
    data.id = pData.value.currentChoose.id
    updateNote(data).then((res) => {
      getData()
      ElNotification.success({
        title: "消息",
        message: "编辑成功",
      })
      cancel()
    })
  } else {
    data.id = undefined
    //新增
    saveNote(data).then((res) => {
      getData()
      ElNotification.success({
        title: "消息",
        message: "保存成功",
      })
      cancel()
    })
  }
}
const save = () => {
  pData.value.formData.name = pData.value.currentChoose
    ? pData.value.currentChoose.title
    : "未命名"
  pData.value.dialogVisible = true
}

const getNoteDetail = async () => {
  if (!pData.value.currentChoose) return

  let { data } = await getNote(pData.value.currentChoose.id)
  if (data.encryption == 1 && pData.value.encryptionStatus == 0) {
    pData.value.encryptionFlag = true
  } else {
    pData.value.text = data.text.replace(/<br\/>/g, "\n")
    pData.value.formData.encryption = data.encryption == 1
    pData.value.formData.secret = !!data.uid
  }
}

const chooseItem = (note: noteItem) => {
  console.log(note)
  pData.value.text = ""
  pData.value.currentChoose = note
  getNoteDetail()
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
          <span class="nsfw" @click="nsfw">
            <i
              :class="[
                pData.nsfwVisible ? 'el-icon-star-on' : 'el-icon-star-off',
              ]"
            ></i>
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
        <p>笔记</p>
      </div>
      <div class="note-items">
        <div
          @click="chooseItem(note)"
          v-for="note in noteList"
          :v-id="note.id"
          :v-title="note.title"
          class="note-item"
        >
          <p class="_title">{{ note.title || "未命名" }}</p>
          <p class="_time">{{ dateFormat(note.time) }}</p>
        </div>
      </div>
    </div>

    <!-- 编辑区 -->
    <div class="right-editor">
      <md-editor
        @onSave="save"
        :toolbarsExclude="pData.toolbarsExclude"
        v-model="pData.text"
      />
    </div>

    <!-- 弹窗 -->
    <el-dialog
      title="保存"
      width="420px"
      top="37vh"
      v-model="pData.dialogVisible"
    >
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
    <!-- <v-contextmenu @contextmenu="handleContextmenuShow" ref="contextmenu">
      <v-contextmenu-item @click="handleDel">删除</v-contextmenu-item>
    </v-contextmenu> -->
  </div>
</template>

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
.notebook {
  color: #2c3e50;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  padding: 5px;
  .left-list {
    .left-top {
      height: 65px;
      box-sizing: border-box;
      padding: 10px;
      .tp-btn {
        display: flex;
        justify-content: space-between;
      }
      .back {
        display: flex;
        vertical-align: middle;
        font-size: 14px;
        cursor: pointer;
        span {
          padding: 2px;
        }
      }
      .nsfw {
        font-size: 18px;
        cursor: pointer;
      }
      p {
        margin: 0;
        text-align: center;
        font-size: 18px;
      }
    }
    .note-items {
      @include scrollBar();
      overflow-y: scroll;
      height: calc(100% - 65px);
      flex: 1;
      .note-item {
        height: 50px;
        box-sizing: border-box;
        padding: 10px;
        cursor: pointer;
        border-bottom: 1px solid #eee;

        &:hover {
          transition: all ease 0.4s;
          background: whitesmoke;
        }
        p {
          margin: 0;
        }
        ._title {
          font-size: 14px;
          margin-bottom: 5px;
        }
        ._time {
          font-size: 12px;
          text-align: right;
        }
      }
    }
    width: 230px;
    min-width: 230px;
    height: 100%;
    margin-right: 10px;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
    background-color: #fff;
  }
  .right-editor {
    flex: 1;
    #md-editor-v3 {
      height: 100%;
    }
  }
}
.none {
  display: none;
}

//

.dialog-footer {
  text-align: right;
}

.question {
  position: relative;
  left: 6px;
  color: #c1c1c1;
}
</style>
