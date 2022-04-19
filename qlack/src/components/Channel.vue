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

  <q-dialog v-model="confirm">
    <q-card>
      <q-card-section class="row items-center">
        <span>
          You've been invited to join: <strong>{{ name }}</strong>
        </span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn @click="declineInvite(id)" flat label="Decline" color="primary" v-close-popup />
        <q-btn @click="acceptInvite(id)" flat label="Accept" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { mapMutations } from 'vuex'

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
    ...mapMutations('channels', {
      setActiveChannel: 'SET_ACTIVE'
    }),
    declineInvite () {
      void this.$store.dispatch('auth/declineInvite', this.name)
    },
    acceptInvite () {
      void this.$store.dispatch('auth/acceptInvite', this.name)
      void this.$router.push('/channel/' + String(this.name))
    },
    manageChannel () {
      if (this.userState === 'invited') {
        this.confirm = true
      } else {
        this.setActiveChannel(this.name)
        void this.$router.push('/channel/' + String(this.name))
        if (this.$q.screen.width < 1024) {
          this.$store.commit('mainStore/updateLeftDrawerState', false)
        }
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
