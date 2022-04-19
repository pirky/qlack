/* eslint-disable */
<template>
  <q-page-sticky expand position="top" class="background_channel_name text-dark bg-accent">
    <q-toolbar>
      <q-item-section v-if="state === 'private'" avatar>
        <q-icon name="fa fa-solid fa-lock"/>
      </q-item-section>

      <q-item-section v-if="state === 'public'" avatar>
        <q-icon name="fa fa-solid fa-hashtag"/>
      </q-item-section>

      <q-toolbar-title class="text-bold">
        {{ name }}
      </q-toolbar-title>
    </q-toolbar>
    <q-btn
      class="add_btn q-pa-sm q-mr-sm"
      icon="logout"
      size="1em"
      style="min-height: 0; position: absolute; right: 0.2em"
      @click="confirm(createdBy === userId(), deleteChannel, name, id, this.$router)"
    />
  </q-page-sticky>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { mapGetters } from 'vuex'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ChannelName',

  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    createdBy: {
      type: Number,
      required: true
    }
  },

  data () {
    const $q = useQuasar()
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      confirm (isOwner: boolean, deleteChannel: any, name: string, id: number, router: any) {
        $q.dialog({
          title: 'Leaving?',
          message: isOwner ? 'Are you sure you want to delete this channel?' : 'Are you sure you want to leave this channel?',
          cancel: true,
          persistent: true
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
        }).onOk(async () => {
          const success = await deleteChannel(name, id)
          console.log(success)
          if (success) {
            router.push('/')
            $q.notify({
              color: 'positive',
              message: isOwner ? 'Channel deleted' : 'You have left the channel'
            })
          } else {
            $q.notify({
              color: 'negative',
              message: isOwner ? 'Error deleting channel' : 'Error leaving channel'
            })
          }
        })
      }
    }
  },

  methods: {
    ...mapGetters('auth', {
      userId: 'id'
    }),
    async deleteChannel (channelName: string, channelId: number) {
      return this.$store.dispatch('channels/deleteChannel', {
        channelName,
        channelId
      }).then((response) => response.data())
    }
  }
})
</script>

<style scoped>
.background_channel_name {
  opacity: 0.9;
}
</style>
