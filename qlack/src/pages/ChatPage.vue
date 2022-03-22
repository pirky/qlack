<template>
  <q-page class="background">
    <q-page class="flex column q-pa-md" padding style="padding: 6em 0 6.2em 0">

      <q-infinite-scroll @load="onLoad" :offset="250" reverse v-if="channel != null">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>

        <div v-for="message in messages" v-bind:key="message.id" class="q-pa-md">
          <Message v-bind="message" v-if="$route.params.id"/>
        </div>
      </q-infinite-scroll>
    </q-page>

    <ChannelName v-bind="channel" v-if="channel != null"/>
    <CommandLine/>
  </q-page>

</template>

<script lang="ts">

import ChannelName from 'components/ChannelName.vue'
import CommandLine from 'components/CommandLine.vue'
import Message from 'components/Message.vue'
import { defineComponent } from 'vue'
import channelInterface from '../store'

const messages = [{
  id: 1,
  author: 'petrzlak',
  author_id: 1,
  initials: 'P',
  time: String(1).concat(' minutes ago'),
  text: 'Wasuuup'
}]

export default defineComponent({
  name: 'ChatPage',

  components: {
    ChannelName,
    CommandLine,
    Message
  },

  computed: {
    channel () {
      return (<typeof channelInterface> this.$store.getters['userStore/activeChannel'](
        Number(this.$route.params.id)
      ))
    }
  },

  data () {
    return {
      messages: messages,
      onLoad (index: number, done: () => void) {
        setTimeout(() => {
          messages.splice(0, 0,
            {
              id: 100 + index * 2 + 1,
              author: 'petrzlak',
              author_id: 1,
              initials: 'P',
              time: String(100 + index * 2 + 1).concat(' minutes ago'),
              text: 'Wasuuup'
            },
            {
              id: 100 + index * 2,
              author: 'kablis',
              author_id: 0,
              initials: 'K',
              time: String(100 + index * 2).concat(' minutes ago'),
              text: 'Zdarec starec'
            }
          )
          done()
        }, 1000)
      }
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
