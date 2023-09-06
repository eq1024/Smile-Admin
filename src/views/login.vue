<script setup lang="ts">
import { message } from 'ant-design-vue/es'
import { userStore } from '@/stores/user'

interface LoginForm {
  phone: string
  password: string
  remember: boolean
}
const form = reactive<LoginForm>({
  phone: '',
  password: '',
  remember: true,
})
const loading = reactive({
  login: false,
})
const router = useRouter()
const user = userStore()

async function login() {
  loading.login = true
  user.login(form.phone, form.password).then((_) => {
    console.log('送到哪五道口敬爱的', _)

    router.replace('/dashboard')
  }).catch((err) => {
    loading.login = false
    message.error(err)
  })
}
</script>

<template>
  <main class="main">
    <section class="login-wrapper">
      <h2 class="title">
        smile-admin
      </h2>
      <AForm name="loginForm" :model="form" layout="vertical" class="login-form shadow" @finish="login">
        <AFormItem name="phone" :rules="[{ required: true, message: '账号不能为空!' }]">
          <AInput v-model:value="form.phone" placeholder="admin" size="large">
            <template #prefix>
              <UserOutlined />
            </template>
          </AInput>
        </AFormItem>
        <AFormItem name="password" :rules="[{ required: true, message: '密码不能为空!' }]">
          <AInputPassword v-model:value="form.password" placeholder="123456" size="large">
            <template #prefix>
              <LockOutlined />
            </template>
          </AInputPassword>
        </AFormItem>
        <AFormItem name="remember" no-style>
          <div style="margin-bottom: .7rem">
            <ACheckbox v-model:checked="form.remember">
              记住我
            </ACheckbox>
          </div>
        </AFormItem>
        <AButton type="primary" style="width: 100%;border-radius: 6px;" size="large" html-type="submit" :loading="loading.login">
          登录
        </AButton>
      </AForm>
    </section>
  </main>
</template>

<style scoped lang="less">
.main {
  // background-image: linear-gradient(-170deg, #44cee9, #2b74c1);
  background: url('@/assets/loginBg.webp');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .login-wrapper {
    margin-top: -10rem;

    .title {
      color: var(--white);
      text-align: center;
    }

    .login-form {
      background-color: var(--white);
      padding: 2rem 1.5rem;
      width: 25rem;
      border-radius: .5rem;

      .wrapper-remember {
        margin-bottom: 1rem;
      }
    }
  }
}
</style>
