<template>
  <div :class="{ tagMessage: isTagged }">
    <q-chat-message
      :sent="authorId === currentUserId"
      :text-color="authorId === currentUserId? 'dark': 'white'"
      :bg-color="authorId === currentUserId? 'amber': 'primary'"
    >
      <template v-slot:name>{{ authorNickname }}</template>
      <template v-slot:stamp>{{ parseTime(sendTime) }}</template>
      <template v-slot:avatar>
        <q-avatar color="secondary" text-color="black" style="margin: 0 10px;">
          {{ authorNickname[0].toUpperCase() }}
        </q-avatar>
      </template>
      <q-markdown>
{{ content }}
      </q-markdown>
    </q-chat-message>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import '@quasar/quasar-ui-qmarkdown/dist/index.css'

export default defineComponent({
  name: 'Message',

  props: {
    id: {
      type: Number,
      required: true
    },
    authorId: {
      type: Number,
      required: true
    },
    authorNickname: {
      type: String,
      required: true
    },
    sendTime: {
      type: Date,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },

  computed: {
    currentUserId: {
      get () {
        return this.$store.state.userStore.id
      },
      set (val: number) {
        this.$store.commit('userStore/updateId', val)
      }
    },
    currentUserNickname: {
      get () {
        return this.$store.state.userStore.nickname
      },
      set (val: number) {
        this.$store.commit('userStore/updateNickname', val)
      }
    },
    isTagged () {
      return this.content.includes('@' + this.currentUserNickname)
    }
  },

  methods: {
    parseTime (sendTime: Date) {
      const minDiff = Math.floor((Date.now() - sendTime.getTime()) / 1000 / 60)
      if (minDiff < 60) {
        return `${minDiff} minute${minDiff === 1 ? '' : 's'} ago.`
      }

      const hourDiff = Math.floor(minDiff / 60)
      if (hourDiff < 24) {
        return `${hourDiff} hour${hourDiff === 1 ? '' : 's'} ago.`
      }

      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      return `${weekdays[sendTime.getDay()]} ${months[sendTime.getMonth()]} ${sendTime.getDate()} ${sendTime.getFullYear()}`
    }
  }
})

</script>

<style>
.tagMessage {
  background-color: rgba(136,139,148,0.3);
  border-radius: 0.5em;
  padding: 0.3em 0;
}

.q-markdown p {
  margin: 0;
}
</style>
