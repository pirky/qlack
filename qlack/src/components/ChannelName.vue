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
      @click="confirm"
    />
  </q-page-sticky>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'

export default {
  name: 'ChannelName',
  data () {
    const $q = useQuasar()
    return {
      confirm () {
        $q.dialog({
          title: 'Leaving?',
          message: 'Are you sure you want to leave this channel?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          console.log('Yeeea, im out')
        })
      }
    }
  },
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
  }
}
</script>

<style scoped>
.background_channel_name {
  opacity: 0.9;
}
</style>
