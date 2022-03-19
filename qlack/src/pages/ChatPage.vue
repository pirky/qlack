<template>
  <q-page class="background">
    <q-page class="flex column" padding style="padding: 61px 0">

      <q-infinite-scroll @load="onLoad(index, done)" reverse>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
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
  id: 61,
  author: 'Arnost Kabel',
  initials: 'AK',
  time: String(61).concat(' minutes ago'),
  text: 'Zdarec starec'
}]

for (let i = 0; i < 20; i++) {
  messages.push({
    id: 61 - i * 3 - 1,
    author: 'Arnost Kabel',
    initials: 'AK',
    time: String(61 - i * 3 - 1).concat(' minutes ago'),
    text: 'Zdarec starec'
  })
  messages.push({
    id: 61 - i * 3 - 2,
    author: 'Janko Petrzlen',
    initials: 'JP',
    time: String(61 - i * 3 - 2).concat(' minutes ago'),
    text: 'Already building an app with it...'
  })
  messages.push({
    id: 61 - i * 3 - 3,
    author: 'Janko Petrzlen',
    initials: 'JP',
    time: String(61 - i * 3 - 3).concat(' minutes ago'),
    text: 'Wasuuup'
  })
}

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
          console.log(index)
          for (let i = 0; i < 20; i++) {
            messages.push({
              id: 61 - i * 3 - 1,
              author: 'Arnost Kabel',
              initials: 'AK',
              time: String(61 - i * 3 - 1).concat(' minutes ago'),
              text: 'Zdarec starec'
            })
            messages.push({
              id: 61 - i * 3 - 2,
              author: 'Janko Petrzlen',
              initials: 'JP',
              time: String(61 - i * 3 - 2).concat(' minutes ago'),
              text: 'Already building an app with it...'
            })
            messages.push({
              id: 61 - i * 3 - 3,
              author: 'Janko Petrzlen',
              initials: 'JP',
              time: String(61 - i * 3 - 3).concat(' minutes ago'),
              text: 'Wasuuup'
            })
          }
          done()
        }, 2000)
      }
    }
  }

})
</script>

<style  scoped>
.background {
  background-image: url('../statics/background.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}
</style>
