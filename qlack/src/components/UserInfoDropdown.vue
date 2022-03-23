<template>
  <q-btn-dropdown
    class="shadow-1 dropdownProfile"
    color="dark"
    :label="nickname"
    icon="fa fa-solid fa-address-card"
  >
    <div class="row no-wrap q-pa-md">
      <div class="column items-md-start">
        <div class="text-h6 q-mb-md">Profile</div>

        <div class="text-subtitle2 q-mt-md q-mb-xs">{{ firstName }} {{ lastName }}</div>

        <div class="text-subtitle q-mt-md q-mb-xs">{{ email }}</div>
      </div>

      <q-separator vertical inset class="q-mx-lg" />

      <div class="column items-center">
        <q-avatar color="secondary" text-color="dark">
          {{ nickname[0].toUpperCase() }}
        </q-avatar>

        <div class="text-subtitle1 q-mt-md q-mb-xs">{{ nickname }}</div>

      </div>
    </div>
  </q-btn-dropdown>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserInfoDropdown',
  methods: {
    logout () {
      console.log('Logging out')
    }
  },
  computed: {
    firstName: {
      get () {
        return this.$store.state.userStore.firstName
      },
      set (val) {
        this.$store.commit('userStore/updateFirstName', val)
      }
    },
    lastName: {
      get () {
        return this.$store.state.userStore.lastName
      },
      set (val) {
        this.$store.commit('userStore/updateLastName', val)
      }
    },
    nickname: {
      get () {
        return this.$store.state.userStore.nickname
      },
      set (val) {
        this.$store.commit('userStore/updateNickname', val)
      }
    },
    email: {
      get () {
        return this.$store.state.userStore.email
      },
      set (val) {
        this.$store.commit('userStore/updateEmail', val)
      }
    },
    status: {
      get () {
        return this.$store.state.userStore.state
      },
      set (val) {
        this.$store.commit('userStore/updateState', val)
      }
    },
    notificationType: {
      get () {
        return this.$store.state.userStore.notificationType
      },
      set (val) {
        this.$store.commit('userStore/updateNotificationType', val)
      }
    }
  },
  data () {
    return {
      options: ['online', 'dnd', 'offline']
    }
  }
})
</script>

<style scoped>
.dropdownProfile {
  position: absolute;
  right: 4em;
  top: 0.5em;
}

.statusSelect {
  width: 110px;
}

</style>
