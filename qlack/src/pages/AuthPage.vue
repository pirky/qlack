<template>
  <q-page class="q-pa-md" style="max-width: 500px; margin-left: auto; margin-right: auto;">
    <q-card class="full-width">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="login" label="Login" />
        <q-tab name="register" label="Register" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <LoginRegister :tab="tab" />
        </q-tab-panel>

        <q-tab-panel name="register">
          <LoginRegister :tab="tab" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script lang="ts">

import { ref, defineComponent } from 'vue'
import LoginRegister from 'components/LoginRegister.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    LoginRegister
  },

  data () {
    return {
      tab: ref('login')
    }
  },

  methods: {
  }
})

</script>
