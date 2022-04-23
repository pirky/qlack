<template>
  <q-page class="background">
    <q-page class="flex column q-pa-md justify-end" padding style="padding: 6em 0 6.2em 0" ref="scrollArea">
      <q-infinite-scroll @load="onLoad" :offset="250" reverse :key="scrollKey" v-if="channel != null">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>

        <div v-for="message in messages" v-bind:key="message.id" class="q-pa-md">
          <Message v-bind="message" v-if="channel != null"/>
        </div>
      </q-infinite-scroll>
      <!-- <div v-for="message in messages" v-bind:key="message.id" class="q-pa-md">
        <Message v-bind="message" v-if="channel != null"/>
      </div> -->
    </q-page>

    <ChannelName v-bind="channel" v-if="channel != null"/>
    <CommandLine v-bind="channel ? channel : null"/>
  </q-page>

</template>

<script lang="ts">

import ChannelName from 'components/ChannelName.vue'
import CommandLine from 'components/CommandLine.vue'
import Message from 'components/Message.vue'
import { defineComponent } from 'vue'
import { Channel, Channel as ChannelInterface, Message as MessageInterface } from 'src/contracts'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'ChatPage',

  components: {
    ChannelName,
    CommandLine,
    Message
  },

  mounted () {
    const channelName = this.$route.params.channelName
    if (this.$store.getters['channels/joinedChannels'].includes(channelName)) {
      void this.$store.dispatch('channels/setActiveChannel', channelName)
    }
  },

  watch: {
    // watch store for new messages and show notification
    '$store.state.channels.latestMessage': function () {
      this.scrollToBottom()

      const message = this.$store.state.channels.latestMessage
      if (!message) return

      const user = this.$store.state.auth.user
      if (user?.activeState === 'dnd') return

      if (user?.notificationType === 'tagged') {
        if (!message.content.split(' ').includes('@' + user.nickname)) {
          return
        }
      }

      const channel: Channel = this.$store.getters['channels/channelById'](message.channelId)

      if (!this.useQuasar.appVisible) {
        let messageContent = message.content
        if (message.content.length > 75) {
          messageContent = message.content.slice(0, 75) + '...'
        }

        this.useQuasar.notify({
          // If longer, replace rest with ...
          message: messageContent,
          caption: `${message.author.nickname} ${channel.name}`,
          color: 'accent',
          textColor: 'black',
          icon: 'fa fa-solid fa-message',
          group: channel.name,
          position: 'top',
          actions: [
            { label: 'Dismiss', color: 'primary', handler: () => { /* ... */ } }
          ]
        })
      }
    }
  },

  computed: {
    channel (): ChannelInterface {
      return this.$store.getters['channels/activeChannel'](
        this.$route.params.channelName
      )
    },
    messages (): MessageInterface[] {
      return this.$store.getters['channels/currentMessages']
    }
  },

  data () {
    const $q = useQuasar()
    return {
      scrollKey: 0,
      useQuasar: $q
      // onLoad (index: number, done: (arg: boolean) => void) {
      //   setTimeout(() => {
      //     this.messages.splice(0, 0,
      //       {
      //         id: 100 + index * 2 + 1,
      //         authorNickname: 'petrzlak',
      //         author_id: 1,
      //         initials: 'P',
      //         time: String(100 + index * 2 + 1).concat(' minutes ago'),
      //         text: 'Wasuuup'
      //       },
      //       {
      //         id: 100 + index * 2,
      //         authorNickname: 'kablis',
      //         author_id: 0,
      //         initials: 'K',
      //         time: String(100 + index * 2).concat(' minutes ago'),
      //         text: 'Zdarec starec'
      //       }
      //     )
      //     done(true)
      //     // NOT DONE YET
      //     // done(false)
      //   }, 1000)
      // }
    }
  },

  methods: {
    scrollToBottom () {
      this.scrollKey++
    }
  }
})
</script>

<style scoped>
.background {
  background-image: url('../statics/bg-chat.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}
</style>
