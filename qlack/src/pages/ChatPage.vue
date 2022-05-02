<template>
  <q-page class="background">
    <q-page class="flex column q-pa-md justify-end" padding style="padding: 6em 0 6.2em 0" ref="scrollArea">
      <q-infinite-scroll @load="onLoad" :offset="500" reverse :key="scrollKey" ref="infiScroll" v-if="channel != null">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>

        <div v-for="message in messages" v-bind:key="message.id" class="q-pa-md">
          <Message v-bind="message" v-if="channel != null"/>
        </div>
      </q-infinite-scroll>
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
import { Channel, Channel as ChannelInterface } from 'src/contracts'
import { useQuasar } from 'quasar'

let self: any = null
let canLoad = false

function timeout (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default defineComponent({
  name: 'ChatPage',

  components: {
    ChannelName,
    CommandLine,
    Message
  },

  created () {
    self = this
  },

  mounted () {
    const channelName = this.$route.params.channelName
    if (this.$store.getters['channels/joinedChannels'].includes(channelName)) {
      void this.$store.dispatch('channels/setActiveChannel', channelName)
    }
    canLoad = true

    if (Notification.permission === 'default') {
      Notification.requestPermission().then(function (result) {
        console.log('notifications', result)
      }).catch(function (err) {
        console.log('notifications err', err)
      })
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

        if (Notification.permission === 'granted') {
          const notification = new Notification(channel.name, {
            body: messageContent,
            icon: 'https://icons-for-free.com/download-icon-quasar-1324440220466918651_512.png'
          })
          notification.onclick = async function () {
            await self.$store.dispatch('channels/setActiveChannel', channel.name)
            void await self.$router.push('/channel/' + String(channel.name))
            notification.close()
          }
        }
        // else {
        //   this.useQuasar.notify({
        //     message: messageContent,
        //     caption: `${message.author.nickname} ${channel.name}`,
        //     color: 'accent',
        //     textColor: 'black',
        //     icon: 'fa fa-solid fa-message',
        //     group: channel.name,
        //     position: 'top',
        //     actions: [
        //       { label: 'Dismiss', color: 'primary', handler: () => { /* ... */ } }
        //     ]
        //   })
        // }
      }
    },

    '$store.state.channels.active': function () {
      const infiScroll: any = self.$refs.infiScroll
      if (infiScroll) {
        infiScroll.resume()
      }

      if (self.$store.state.channels.active) {
        canLoad = true
      }
    }

    // watch store for channel change
    // '$store.state.channels.active': function () {
    //   if (!this.$store.state.channels.active && this.$store.state.channels.users.length === 0) {
    //     void this.$router.push('/')
    //   }
    // }
  },

  computed: {
    channel (): ChannelInterface {
      return this.$store.getters['channels/activeChannel'](
        this.$route.params.channelName
      )
    },

    messages () {
      const messages = self.$store.getters['channels/currentMessages']
      // if (messages.length === 0) {
      //   const infiScroll: any = self.$refs.infiScroll
      //   if (infiScroll && canLoad) {
      //     infiScroll.resume()
      //     console.log('resume')
      //   }
      // }
      return messages
    }
  },

  data () {
    const $q = useQuasar()
    return {
      scrollKey: 0,
      useQuasar: $q,

      async onLoad (index: number, done: (arg: boolean) => void) {
        await timeout(50)
        if (self.$store.getters['mainStore/channelDialog'] ||
          (window.innerWidth < 1024 && (self.$store.getters['mainStore/leftSideDrawer'] || self.$store.getters['mainStore/rightSideDrawer']))) {
          done(false)
          return
        }

        if (canLoad) {
          canLoad = false
          const result = await self.$store.dispatch('channels/loadMessages')
          canLoad = true

          done(!result)
          return
        }

        done(false)
      }
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
