<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { getNote } from 'src/api/notebook'
const text = ref('')
const _text = ref('')
const params: any = useRoute().params
const encryptionFlag = ref(false)
const hasValid = ref(false)

const getNoteDetail = async () => {
  const { data } = await getNote(params.id)
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
})
</script>

<template>
  <md-editor v-model="text" :previewOnly="true"> </md-editor>
  <!-- 验证独立密码 -->
  <encryption-dialog
    v-if="encryptionFlag"
    @close="closeEncryption"
    :visible="encryptionFlag"
    @validSuccess="validSuccess"
  ></encryption-dialog>
</template>

<style lang="scss" scoped>
.md {
  padding: 40px;
}
</style>
