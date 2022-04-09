<template>
  <q-item clickable
          target="_self"
          :to="'/' + id"
          @click="changeUserState(id)"
  >
    <q-item-section v-if="state === 'private'" avatar>
        <q-icon :class="{invitationChannel: userState === 'invited'}" name="fa fa-solid fa-lock" />
    </q-item-section>

    <q-item-section v-if="state === 'public'" avatar>
      <q-icon :class="{invitationChannel: userState === 'invited'}" name="fa fa-solid fa-hashtag" />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="{invitationChannel: userState === 'invited'}">
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
    userState: {
      type: String,
      required: true
    },
    createdBy: {
      type: Number,
      required: true
    }
  },
  methods: {
    changeUserState (id: number) {
      this.$store.commit('auth/updateUserChannelState', { value: 'joined', id: id })
    }
  },
  computed: {

  }

})
</script>

<style>
.invitationChannel {
  color: #F2C037;
}
</style>
