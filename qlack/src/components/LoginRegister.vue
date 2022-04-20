<template>
  <q-form @submit="submitForm">
    <q-input
      v-if="tab === 'register'"
      v-model="form.firstName"
      class="q-ma-md"
      outlined
      label="First name"
    />
    <q-input
      v-if="tab === 'register'"
      v-model="form.lastName"
      class="q-ma-md"
      outlined
      label="Last name"
    />
    <q-input
      v-if="tab === 'register'"
      v-model="form.nickname"
      class="q-ma-md"
      outlined
      label="Nickname"
    />
    <q-input
      v-model="form.email"
      class="q-ma-md"
      outlined
      type="email"
      label="Email"
    />
    <q-input
      v-model="form.password"
      class="q-ma-md"
      outlined
      type="password"
      label="Password"
    />

    <div class="row">
      <a
        class="q-ma-md forgot_link"
        v-if="tab === 'login'"
        href="/auth"
      >Forgot password?</a>
      <q-space />
      <q-btn
        class="q-ma-md self-right"
        type="submit"
        color="primary"
        :loading="loading"
        :label="tab"
      />
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginRegister',

  computed: {
    loading (): boolean {
      return this.$store.state.auth.status === 'pending'
    }
  },

  props: {
    tab: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      form: {
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
      this.$store.dispatch(`auth/${this.tab}`, this.form).then(
        () => this.$router.push('/')
      ).catch((e) => { console.log('submit error: ', e) }
      )
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
