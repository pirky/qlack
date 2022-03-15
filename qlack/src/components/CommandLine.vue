<template>
  <q-page-sticky expand position="bottom" class="bg-primary commandLine" >
    <q-input
      v-model="newMessage"
      bg-color="white"
      class="full-width input"
      outlined
      autogrow
      input-style="max-height: 12em"
      label="Message">
      <template v-slot:after>
        <q-btn round dense flat icon="send" color="white"/>
      </template>
    </q-input>
  </q-page-sticky>
</template>

<script>
export default {
  name: 'CommandLine',

  props: {
    id: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    is_private: {
      type: Boolean,
      required: true
    }
  },

  data () {
    return {
      newMessage: ''
    }
  }
}
</script>

<style scoped>
.commandLine {
  padding: 0.4em;
}
</style>
