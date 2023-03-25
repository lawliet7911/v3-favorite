<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { checkPwd } from 'src/api/user'
import storage from 'src/utils/storage'

import { useRoute, useRouter } from 'vue-router'
import { useUserState } from 'src/store'
// import { useDark, useToggle } from '@vueuse/core'
// const isDark = useDark()
// const toggleDark = useToggle(isDark)

const userState = useUserState()
const route = useRoute()
const router = useRouter()

interface LoginObj {
  animation: boolean
  remember: boolean
  logoutAnimation: boolean
  logout: boolean
  exp: number
}
const loginObj: Ref<LoginObj> = ref({
  animation: false,
  remember: false,
  logoutAnimation: false,
  logout: false,
  exp: 15
})

interface LoginModel {
  username: string
  pwd: string
}

const loginData: LoginModel = {
  username: '',
  pwd: ''
}

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const form: Ref<LoginModel> = ref(loginData)

const loginForm: Ref<FormInstance | undefined> = ref()

const login = async (): Promise<void> => {
  const validateResult = await (loginForm.value as FormInstance).validate()
  if (!validateResult) return
  const { data } = await checkPwd(loginData)
  if (data.length) {
    const d = data[0]
    delete d.pwd
    userState.setUser(d)
    if (loginObj.value.remember) storage.set('user', d, loginObj.value.exp * 24)
    else storage.set('user', d)
    loginObj.value.animation = true
    // 动画完成跳转
    setTimeout(() => {
      router.push({ name: 'Home' })
    }, 700)
  }
}

onMounted(() => {
  let { params } = route
  if (params.logout == '1') {
    loginObj.value.logout = true
    setTimeout(() => {
      loginObj.value.logoutAnimation = true
    }, 0)
    setTimeout(() => {
      loginObj.value.logout = false
      loginObj.value.logoutAnimation = false
    }, 700)
  }
})
</script>

<template>
  <div class="login">
    <div
      :class="[
        loginObj.animation ? 'success' : '',
        loginObj.logout ? 'logout' : '',
        loginObj.logoutAnimation ? 'logout-anim' : '',
        'login-form'
      ]"
    >
      <div class="title" :class="{ out: loginObj.animation }">登 录</div>
      <el-form
        :model="form"
        class="form"
        :class="{ out: loginObj.animation }"
        :rules="rules"
        ref="loginForm"
      >
        <el-form-item class="form-item" label="用户名" prop="username" label-width="80px">
          <el-input v-model.trim="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="form-item" label="密码" prop="pwd" label-width="80px">
          <el-input v-model.trim="form.pwd" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="form-item">
          <el-checkbox v-model="loginObj.remember">记住密码</el-checkbox>
          <el-select
            class="sel-exp"
            placeholder="保存天数"
            v-show="loginObj.remember"
            v-model="loginObj.exp"
          >
            <el-option label="15天" :value="15"></el-option>
            <el-option label="30天" :value="30"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="login-btn" :class="{ out: loginObj.animation }" @click="login()">确 定</div>
      <!-- <div class="tte" @click="toggleDark">12313</div> -->
    </div>
    <a class="link" href="https://beian.miit.gov.cn/">备案号：鄂ICP备2022001970号-1</a>
  </div>
</template>

<style lang="scss" scoped>
@import './login.scss';
.link {
  position: absolute;
  bottom: 20px;
}
</style>
