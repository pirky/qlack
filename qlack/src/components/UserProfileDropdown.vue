<template>
  <q-btn-dropdown
    class="shadow-1 dropdownProfile"
    color="dark"
    icon="fa fa-solid fa-address-card"
  >
    <div class="row no-wrap q-pa-md">
      <div class="column items-md-start">
        <div class="text-h6 q-mb-md">{{ firstName }} {{ lastName }}</div>

        <q-select
          class="statusSelect"
          v-model="this.localStatus"
          :options="options"
          model-value="{{this.localStatus}}"
          filled
          @update:model-value="changeStatus()"
        >
          <template v-slot:append>
            <q-icon v-if="this.localStatus === 'online'" name="fa fa-solid fa-circle" size="0.5em" color="positive" />
            <q-icon v-if="this.localStatus === 'dnd'" name="fa fa-solid fa-circle" size="0.5em" color="negative" />
            <q-icon v-if="this.localStatus === 'offline'" name="fa fa-solid fa-circle" size="0.5em" color="gray" />
          </template>
        </q-select>

        <q-toggle
          :label="notificationType"
          v-model="notificationType"
          color="primary"
          checked-icon="check"
          true-value="all"
          unchecked-icon="tag"
          false-value="tagged"
          keep-color
          @update:model-value="changeNotificationType()"
        />

      </div>

      <q-separator vertical inset class="q-mx-lg" />

      <div class="column items-center">
        <q-avatar color="secondary" text-color="dark">
          {{ nickname[0].toUpperCase() }}
        </q-avatar>

        <div class="text-subtitle1 q-mt-md q-mb-xs">{{ nickname }}</div>
        <div class="text-subtitle q-mb-xs">{{ email }}</div>

        <q-btn
          class="q-mt-lg content-center"
          color="primary"
          label="Logout"
          push
          size="md"
          v-close-popup
          @click="logout"
          icon-right="logout"
        />
      </div>
    </div>
  </q-btn-dropdown>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserProfileDropdown',
  methods: {
    logout () {
      this.$store.dispatch('auth/logout').then(
        () => this.$router.push('/auth')
      ).catch((e) => { console.log('logout error: ', e) }
      )
    },

    async changeStatus () {
      await this.$store.dispatch('channels/updateState', this.localStatus)
    },

    async changeNotificationType () {
      await this.$store.dispatch('channels/updateNotification', this.notificationType)
    }
  },

  computed: {
    firstName: {
      get () {
        return this.$store.state.auth.user.firstName
      },
      set (val) {
        this.$store.commit('auth/updateFirstName', val)
      }
    },
    lastName: {
      get () {
        return this.$store.state.auth.user.lastName
      },
      set (val) {
        this.$store.commit('auth/updateLastName', val)
      }
    },
    nickname: {
      get () {
        return this.$store.state.auth.user.nickname
      },
      set (val) {
        this.$store.commit('auth/updateNickname', val)
      }
    },
    email: {
      get () {
        return this.$store.state.auth.user.email
      },
      set (val) {
        this.$store.commit('auth/updateEmail', val)
      }
    },
    notificationType: {
      get () {
        return this.$store.state.auth.user.notificationType
      },
      set (val) {
        this.$store.commit('auth/updateNotificationType', val)
      }
    }
  },
  data () {
    return {
      localStatus: '',
      options: ['online', 'dnd', 'offline']
    }
  },
  mounted () {
    this.localStatus = this.$store.state.auth.user.activeState
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
