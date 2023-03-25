<template>
  <el-dialog
    title="验证独立密码"
    width="500px"
    :model-value="props.visible"
    :before-close="cancel"
    :closeOnClickModal="false"
  >
    <el-form :model="_data.form" :rules="rules" ref="encryptionForm">
      <el-form-item label="密码" prop="pwd" label-width="100px">
        <el-input
          v-model="_data.form.pwd"
          @change="resetValid"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="info">刷新或切换其他路由页面后需重新验证！</div>
    <div v-if="_data.tip" class="tips">{{ _data.tip }}</div>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="login(encryptionForm)">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormRules, FormInstance } from 'element-plus'
import { checkEncryption } from 'src/api/user'
import { useUserState } from 'src/store'

const userState = useUserState()
const props = defineProps({
  visible: Boolean
})

interface formObject {
  pwd: string
}
interface encryption {
  form: formObject
  visible: boolean
  tip: string
}
const _form: formObject = {
  pwd: ''
}

const emit = defineEmits(['close', 'validSuccess'])

let _data = ref<encryption>({
  visible: false,
  form: _form,
  tip: ''
})

const encryptionForm: any = ref<FormInstance>()

const rules: FormRules = {
  pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
const cancel = () => {
  emit('close')
}
const resetValid = () => {
  _data.value.tip = ''
}

const login = (formEl: FormInstance): void => {
  formEl.validate(async (flag: boolean) => {
    if (!flag) return
    let params = {
      pwd: _data.value.form.pwd,
      uid: userState.user.id
    }
    let data = await checkEncryption(params)
    if (data.data) {
      emit('validSuccess')
      cancel()
    } else {
      _data.value.tip = '密码错误'
    }
  })
}
</script>
<style lang="scss" scoped>
.tips {
  color: red;
  margin-left: 45px;
}
.info {
  margin-left: 45px;
  margin-bottom: 15px;
  color: #aaa;
}

.dialog-footer {
  text-align: right;
}
</style>
