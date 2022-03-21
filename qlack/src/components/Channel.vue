<template>
  <q-item clickable
          tag="a"
          target="_self"
          :to="'/' + id"
  >
    <q-item-section v-if="is_private" avatar>
        <q-icon name="fa fa-solid fa-lock" />
    </q-item-section>

    <q-item-section v-if="!is_private" avatar>
      <q-icon name="fa fa-solid fa-hashtag" />
    </q-item-section>

    <q-item-section>
      <q-item-label>
        {{ title }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Channel',

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
  },

  computed: {
    computedClass () {
      // console.log(this.$store.state)
      return 'text-dark'
      // return store.state.module-channel.channelName === this.title ? 'activeChanel' : 'text-dark'
    }
  }

})
</script>
