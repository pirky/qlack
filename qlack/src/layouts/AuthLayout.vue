<template>
  <q-layout view="hHh LpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" alt="quasar white logo">
          </q-avatar>
          Qlack
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-image">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  data () {
    return {
    }
  },

  methods: {
  }
})

</script>

<style>

  .bg-image {
    background-image: url("../statics/bg_blob.svg");
    background-repeat: no-repeat;
    background-size: cover;
  }

</style>
