<template>
  <div :class="{ tagMessage: isTagged }">
    <q-chat-message
      :sent="authorId === currentUserId"
      :text-color="authorId === currentUserId? 'dark': 'white'"
      :bg-color="authorId === currentUserId? 'amber': 'primary'"
    >
      <template v-slot:name>{{ author.nickname }}</template>
      <template v-slot:stamp>{{ currentTimestamp }}</template>
      <template v-slot:avatar>
        <q-avatar color="secondary" text-color="black" style="margin: 0 10px;">
          {{ author.nickname[0].toUpperCase() }}
        </q-avatar>
      </template>
      <q-markdown>{{ highlightMentions(content) }}</q-markdown>
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
    createdAt: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: Object,
      required: true
    }
  },

  computed: {
    currentUserId () {
      return this.$store.state.auth.user ? this.$store.state.auth.user.id : null
    },
    currentUserNickname () {
      return this.$store.state.auth.user ? this.$store.state.auth.user.nickname : null
    },
    isTagged () {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      return this.content.split(' ').includes('@' + this.currentUserNickname)
    },
    currentTimestamp () {
      return this.parseTime(new Date(this.createdAt))
    }
  },

  created () {
    setInterval(function (self) {
      self.now = Date.now()
    }, 500, this)
  },

  data () {
    return {
      now: Date.now()
    }
  },

  methods: {
    parseTime (sendTime: Date) {
      const minDiff = Math.floor((this.now - sendTime.getTime()) / 1000 / 60)

      if (minDiff < 1) {
        return 'just now.'
      }

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
    },

    highlightMentions (content: string): string {
      const words = content.split(' ')

      const newWords = words.map((word: string) => {
        if (word.startsWith('@')) {
          const userName = word.slice(1)
          const userNames = this.$store.state.channels.users.map((user) => user.nickname)

          if (userNames.includes(userName)) {
            return `**${word}**`
          }
        }

        return word
      })

      return newWords.join(' ')
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
