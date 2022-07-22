<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { getNote } from 'src/api/notebook'

let text = ref('')
let _text = ref('')
let params = reactive(useRoute().params)
let encryptionFlag = ref(false)
let hasValid = ref(false)

const getNoteDetail = async () => {
  let { data } = await getNote(params.id)
  if (data.encryption == 1 && !hasValid.value) {
    encryptionFlag.value = true
    _text.value = data.text.replace(/<br\/>/g, '\n')
  } else {
    text.value = data.text.replace(/<br\/>/g, '\n')
  }
}
const closeEncryption = (): void => {
  encryptionFlag.value = false
}

const validSuccess = (): void => {
  hasValid.value = true
  text.value = _text.value
  // getNoteDetail()
}

onMounted(() => {
  getNoteDetail()
  watch(
    () => {
      params.id
    },
    (newv, oldv) => {
      alert(1)
    }
  )
})
</script>

<template>
  <md-editor v-model="text" :previewOnly="true"> </md-editor>
  <!-- 验证独立密码 -->
  <encryption
    v-if="encryptionFlag"
    @close="closeEncryption"
    :visible="encryptionFlag"
    @validSuccess="validSuccess"
  ></encryption>
</template>

<style lang="scss" scoped>
.md {
  padding: 40px;
}
</style>
