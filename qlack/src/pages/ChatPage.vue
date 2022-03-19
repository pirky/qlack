<template>
  <q-page class="background">
    <q-page class="flex column q-pa-md" padding style="padding: 61px 0">

      <q-infinite-scroll @load="onLoad" :offset="250" reverse>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>

        <div v-for="message in messages" v-bind:key="message" class="q-pa-md">
          <Message v-bind="message"/>
        </div>
      </q-infinite-scroll>
    </q-page>

    <ChannelName v-bind="channel"/>
    <CommandLine v-bind="channel"/>
  </q-page>

</template>

<script lang="ts">

import ChannelName from 'components/ChannelName.vue'
import CommandLine from 'components/CommandLine.vue'
import Message from 'components/Message.vue'
import { defineComponent } from 'vue'

const channel = {
  id: 0,
  title: 'First channel ever',
  is_private: false
}

const messages = [{
  id: 1,
  author: 'Janko Petrzlen',
  initials: 'JP',
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

  data () {
    return {
      channel: channel,
      messages: messages,
      onLoad (index: number, done: () => void) {
        setTimeout(() => {
          messages.splice(0, 0,
            {
              id: 100 + index * 2 + 1,
              author: 'Janko Petrzlen',
              initials: 'JP',
              time: String(100 + index * 2 + 1).concat(' minutes ago'),
              text: 'Wasuuup'
            },
            {
              id: 100 + index * 2,
              author: 'Arnost Kabel',
              initials: 'AK',
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
  background-image: url('../statics/background.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}
</style>
