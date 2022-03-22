<template>
  <q-chat-message
    :sent="authorId === currentUserId"
    :text-color="authorId === currentUserId? 'dark': 'white'"
    :bg-color="authorId === currentUserId? 'amber': 'primary'"
  >
    <template v-slot:name>{{ authorNickname }}</template>
    <template v-slot:stamp>{{ sendTime }}</template>
    <template v-slot:avatar>
      <q-avatar color="secondary" text-color="black" style="margin: 0 10px;">
        {{ authorNickname[0].toUpperCase() }}
      </q-avatar>
    </template>
    <div>
      {{ content }}
    </div>
  </q-chat-message>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Message',

  props: {
    id: {
      type: Number
    },
    authorId: {
      type: Number
    },
    authorNickname: {
      type: String
    },
    sendTime: {
      type: Date
    },
    content: {
      type: String
    }
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
