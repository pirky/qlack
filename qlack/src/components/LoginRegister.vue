<template>
  <q-form @submit="submitForm">
    <q-input
      v-if="tab === 'register'"
      v-model="formData.firstName"
      class="q-ma-md"
      outlined
      label="First name"
    />
    <q-input
      v-if="tab === 'register'"
      v-model="formData.lastName"
      class="q-ma-md"
      outlined
      label="Last name"
    />
    <q-input
      v-if="tab === 'register'"
      v-model="formData.nickname"
      class="q-ma-md"
      outlined
      label="Nickname"
    />
    <q-input
      v-model="formData.email"
      class="q-ma-md"
      outlined
      type="email"
      label="Email"
    />
    <q-input
      v-model="formData.password"
      class="q-ma-md"
      outlined
      type="password"
      label="Password"
    />

    <div class="row">
      <a
        class="q-ma-md forgot_link"
        v-if="tab === 'login'"
        href="#/Auth"
      >Forgot password?</a>
      <q-space />
      <q-btn
        class="q-ma-md self-right"
        type="submit"
        color="primary"
        :label="tab"
        :to="'/'"
      />
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginRegister',
  props: [
    'tab'
  ],
  data () {
    return {
      formData: {
        firstName: '',
        lastName: '',
        nickname: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    submitForm () {
      console.log(this.tab)
    }
  }
})
</script>

<style>
.forgot_link {
  color: #EEEEEE;
}

.forgot_link:active {
  color: #00adb5;
}
</style>
