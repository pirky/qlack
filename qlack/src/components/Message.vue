<template>
  <q-chat-message
    :sent="author === 'Arnost Kabel'"
    :text-color="author === 'Arnost Kabel'? 'dark': 'white'"
    :bg-color="author === 'Arnost Kabel'? 'amber': 'primary'"
  >
    <template v-slot:name>{{ author }}</template>
    <template v-slot:stamp>{{ time }}</template>
    <template v-slot:avatar>
      <q-avatar color="secondary" text-color="black" style="margin: 0 10px;">
        {{ initials }}
      </q-avatar>
    </template>
    <div>
      {{ text }}
    </div>
  </q-chat-message>
</template>

<script>
export default {
  name: 'Message',

  props: {
    id: {
      type: Number,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    initials: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
