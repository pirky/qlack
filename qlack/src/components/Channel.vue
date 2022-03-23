<template>
  <q-item clickable
          target="_self"
          :to="'/' + id"
  >
    <q-item-section v-if="state === 'private'" avatar>
        <q-icon name="fa fa-solid fa-lock" />
    </q-item-section>

    <q-item-section v-if="state === 'public'" avatar>
      <q-icon name="fa fa-solid fa-hashtag" />
    </q-item-section>

    <q-item-section>
      <q-item-label>
        {{ name }}
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

  computed: {
  }

})
</script>
