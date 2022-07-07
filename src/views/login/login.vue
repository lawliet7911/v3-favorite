<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { checkPwd } from 'src/api/user'
import storage from 'src/utils/storage'

import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

let store = useStore()
let router = useRouter()
let route = useRoute()

let loginObj = ref({
  animation: false,
  remember: false,
  logoutAnimation: false,
  logout: false,
  exp: 15,
})

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

const loginForm: any = ref<FormInstance>()

let rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

interface loginModel {
  username: string
  pwd: string
}

let loginData: loginModel = {
  username: '',
  pwd: '',
}

let form = ref(loginData)

function resetValid(data: any): void {}

const login = (formEl: FormInstance): void => {
  formEl.validate(async (flag: boolean) => {
    if (!flag) return
    let { data } = await checkPwd(loginData)
    if (data.length) {
      let d = data[0]
      delete d.pwd
      store.commit('SET_USER', d)
      if (loginObj.value.remember) storage.set('user', d, loginObj.value.exp * 24)
      else storage.set('user', d)
      loginObj.value.animation = true
      // 动画完成跳转
      setTimeout(() => {
        router.push({ name: 'Home' })
      }, 700)
    }
  })
}
</script>

<template>
  <div class="login">
    <div
      :class="[
        loginObj.animation ? 'success' : '',
        loginObj.logout ? 'logout' : '',
        loginObj.logoutAnimation ? 'logout-anim' : '',
        'login-form',
      ]"
    >
      <div class="title" :class="{ out: loginObj.animation }">登 录</div>
      <el-form :model="form" class="form" :class="{ out: loginObj.animation }" :rules="rules" ref="loginForm">
        <el-form-item class="form-item" label="用户名" prop="username" label-width="80px">
          <el-input @change="resetValid" v-model.trim="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="form-item" label="密码" prop="pwd" label-width="80px">
          <el-input @change="resetValid" v-model.trim="form.pwd" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="form-item">
          <el-checkbox v-model="loginObj.remember">记住密码</el-checkbox>
          <el-select class="sel-exp" placeholder="保存天数" v-show="loginObj.remember" v-model="loginObj.exp">
            <el-option label="15天" :value="15"></el-option>
            <el-option label="30天" :value="30"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="login-btn" :class="{ out: loginObj.animation }" @click="login(loginForm)">确 定</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './login.scss';
</style>
