<template>
  <q-item
    clickable
    tag="a"
    target="_blank"
  >
    <q-item-section avatar>
      <q-avatar color="secondary" text-color="dark">
        {{ first_name[0] }}{{ last_name[0] }}
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ first_name }} {{ last_name }}</q-item-label>
      <q-item-label caption lines="1">example_email@email.czom</q-item-label>
    </q-item-section>

    <q-item-section avatar>
      <q-icon name="fa fa-solid fa-circle" size="1em" color="positive" />
      <!-- <q-icon name="fa fa-solid fa-circle" size="1em" color="negative" /> -->
      <!-- <q-icon name="fa fa-solid fa-circle" size="1em" color="gray" /> -->
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
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    }
  }
})
</script>
