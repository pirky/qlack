<template>
  <q-page-sticky expand position="top" class="bg-accent text-dark">
    <q-toolbar>
      <q-item-section v-if="is_private" avatar>
        <q-icon name="fa fa-solid fa-lock"/>
      </q-item-section>

      <q-item-section v-if="!is_private" avatar>
        <q-icon name="fa fa-solid fa-hashtag"/>
      </q-item-section>

      <q-toolbar-title>
        {{ title }}
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
    title: {
      type: String,
      required: true
    },
    is_private: {
      type: Boolean,
      required: true
    }
  }

}
</script>

<style scoped>

</style>
