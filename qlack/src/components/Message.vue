<template>
  <q-chat-message
    :sent="author_id === currentUserId"
    :text-color="author_id === currentUserId? 'dark': 'white'"
    :bg-color="author_id === currentUserId? 'amber': 'primary'"
  >
    <template v-slot:name>{{ author }}</template>
    <template v-slot:stamp>{{ time }}</template>
    <template v-slot:avatar>
      <q-avatar color="secondary" text-color="black" style="margin: 0 10px;">
        {{ initials }}
      </q-avatar>
    </template>
    <div>
      {{ text }}
    </div>
  </q-chat-message>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Message',
  props: {
    id: {
      type: Number,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    author_id: {
      type: Number,
      required: true
    },
    initials: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  components: {

  },
  methods: {
  },
  computed: {
    currentUserId: {
      get () {
        return this.$store.state.userStore.id
      },
      set (val) {
        this.$store.commit('userStore/updateId', val)
      }
    }
  }
})

</script>

<style scoped>

</style>
