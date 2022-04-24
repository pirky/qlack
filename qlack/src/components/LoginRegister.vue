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
import AuthService from 'src/services/AuthService'
import { defineComponent } from 'vue'
// import { User } from 'src/contracts'

// let users: any = []

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
    async submitForm () {
      if (this.tab === 'register') {
        const users = await AuthService.getAllUsers()
        const sameName = users.find(user => user.nickname === this.form.nickname)
        const sameEmail = users.find(user => user.email === this.form.email)

        if (this.form.firstName === '' || this.form.lastName === '' || this.form.nickname === '' || this.form.email === '' || this.form.password === '') {
          this.$q.notify({
            color: 'negative',
            message: 'Please fill all the fields'
          })
          return
        }
        if (sameName) {
          this.$q.notify({
            color: 'negative',
            message: 'Nickname already exists'
          })
          return
        }
        if (sameEmail) {
          this.$q.notify({
            color: 'negative',
            message: 'Email already exists'
          })
          return
        }
        if (this.form.password.length < 6) {
          this.$q.notify({
            color: 'negative',
            message: 'Password must be at least 6 characters'
          })
          return
        }
        if (this.form.nickname.length < 3 || this.form.nickname.length > 15) {
          this.$q.notify({
            color: 'negative',
            message: 'Nickname must be between 3 and 15 characters'
          })
          return
        }
      }

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
