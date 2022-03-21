<template>
  <q-page-sticky expand position="top" class="background_channel_name text-dark bg-accent">
    <q-toolbar>
      <q-item-section v-if="is_private" avatar>
        <q-icon name="fa fa-solid fa-lock"/>
      </q-item-section>

      <q-item-section v-if="!is_private" avatar>
        <q-icon name="fa fa-solid fa-hashtag"/>
      </q-item-section>

      <q-toolbar-title class="text-bold">
        {{ name }}
      </q-toolbar-title>
    </q-toolbar>
  </q-page-sticky>
</template>

<script>

export default {
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
      type: String,
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
