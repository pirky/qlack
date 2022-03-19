<template>
  <q-page-sticky expand position="bottom" class="bg-transparent command_line" >
    <q-input
      v-model="newMessage"
      bg-color="dark"
      class="full-width input"
      outlined
      autogrow
      input-style="max-height: 12em; min-height: 2em"
      label="Message">

      <span class="typing">
        <a class="typing_name">Someone</a> is typing...
      </span>

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
.command_line {
  padding: 0.4em;
}

.input {
  opacity: 0.9;
}

.typing {
  position: absolute;
  right: 0.5em;
  top: 0.5em;
  color: #888b94;
  font-size: 0.9em;
}

.typing_name {
  color: #888b94;
  opacity: 1;
}

.typing_name:hover {
  color: #eeeeee;
  opacity: 1;
}
</style>
