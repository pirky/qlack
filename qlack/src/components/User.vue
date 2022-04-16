<template>
  <q-item
    tag="a"
    target="_blank"
  >
    <q-item-section avatar>
      <q-avatar color="secondary" text-color="black">
        {{ nickname[0].toUpperCase() }}
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ nickname }}</q-item-label>
    </q-item-section>

    <q-item-section avatar>
      <q-icon v-if="activeState === 'online'" name="fa fa-solid fa-circle" size="1em" color="positive" />
      <q-icon v-if="activeState === 'dnd'" name="fa fa-solid fa-circle" size="1em" color="negative" />
      <q-icon v-if="activeState === 'offline'" name="fa fa-solid fa-circle" size="1em" color="gray" />
    </q-item-section>

  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'User',
  props: {
    id: {
      type: Number,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    notificationType: {
      type: String,
      required: true
    },
    activeState: {
      type: String,
      required: true
    }
  }
})
</script>
