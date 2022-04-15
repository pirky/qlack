<template>
  <q-item clickable
          target="_self"
          @click="manageChannel()"
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

  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span>
          Do you want to accept invitation to channel <strong>{{ name }}</strong>?
        </span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="No" color="primary" v-close-popup />
        <q-btn @click="changeUserState(id)" flat label="Yes" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

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
  setup () {
    return {
      confirm: ref(false)
    }
  },
  methods: {
    changeUserState () {
      void this.$store.dispatch('auth/acceptInvite', this.id)
      void this.$router.push('/' + String(this.id))
    },
    manageChannel () {
      if (this.userState === 'invited') {
        this.confirm = true
      } else {
        void this.$router.push('/' + String(this.id))
      }
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
