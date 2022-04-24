<template>
  <q-page-sticky expand position="bottom" class="bg-transparent command_line">
    <q-input
      ref="commandLine"
      v-model="newMessage"
      bg-color="dark"
      class="full-width input"
      outlined
      autogrow
      input-style="max-height: 4.5em; min-height: 4.5em"
      label="Message"
      :disable="loading"
      @keydown.shift="shiftDown = true"
      @keyup.shift="shiftDown = false"
      @keydown.enter="send"
      @keyup="onChange"
      >
      <q-item v-show="someoneIsTyping" class="typing_name" clickable>Someone is typing...
        <q-menu fit anchor="top middle" self="bottom middle">
          <q-list style="min-width: 100px">
            <template v-for="writer in writingUsers" :key="writer.nickname">
              <q-item v-show="writer.message !== ''" class="q-pt-sm q-pb-sm q-pl-md q-pr-md" style="min-height: 0">
                {{ writer.nickname.length > 10 ? writer.nickname.substring(0, 10) + '...' : writer.nickname }}
                <q-tooltip anchor="top middle" self="bottom middle">
                  {{ writer.message.length > 20 ? writer.message.substring(0, 20) + '...' : writer.message }}
                </q-tooltip>
              </q-item>
            </template>
          </q-list>
        </q-menu>
      </q-item>

      <template v-slot:after>
        <q-btn
          round
          dense
          flat
          icon="send"
          color="white"
          :disable="loading"
          @click="send"
        />
      </template>
    </q-input>
  </q-page-sticky>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'CommandLine',

  props: {
    id: {
      type: Number
    },
    name: {
      type: String
    },
    state: {
      type: String
    },
    createdBy: {
      type: Number
    }
  },

  data () {
    return {
      newMessage: '',
      loading: false,
      shiftDown: false
    }
  },

  computed: {
    writingUsers () {
      return this.$store.state.channels.writingUsers
    },
    someoneIsTyping () {
      for (const user of this.$store.state.channels.writingUsers) {
        if (user.message !== '') {
          return true
        }
      }
      return false
    }
  },

  mounted () {
    this.focusInput()
  },

  methods: {
    ...mapActions('channels', ['addMessage']),
    ...mapActions('channels', ['currWriting']),
    async send () {
      void await this.currWriting('')
      if (this.newMessage.trim().length === 0) return

      if (this.shiftDown) return

      this.loading = true
      const response = await this.addMessage({ channelName: this.name, message: this.newMessage, router: this.$router })
      this.newMessage = response === true ? '' : this.newMessage
      this.loading = false

      if (response !== true) {
        this.$q.notify({
          color: 'negative',
          message: response
        })
      }
      this.focusInput()
    },

    focusInput () {
      this.$refs.commandLine.$el.focus()
    },

    onChange (key) {
      const dontPrint = [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Control',
        'Alt',
        'Shift'
      ]
      if (dontPrint.includes(key.key)) return
      void this.currWriting(this.newMessage.trim())
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
  display: flex;
  align-items: flex-end;
}

.typing_name {
  position: absolute;
  top: 0.4em;
  right: 0;
  margin: 0;
  padding: 0;
  width: auto;
  font-size: 0.9em;
  max-height: 2.5em;
  min-height: 0;
  color: #888b94;
  opacity: 1;
}

.typing_name:hover {
  color: #eeeeee;
  background-color: #393e46;
  opacity: 1;
}
</style>
