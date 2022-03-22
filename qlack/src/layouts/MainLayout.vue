/* eslint-disable */
<template>
  <q-layout view="hHh LpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="fa fa-solid fa-bars" @click="leftDrawerState = !leftDrawerState" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" alt="quasar white logo">
          </q-avatar>
          Qlack
        </q-toolbar-title>

        <q-btn dense flat round icon="fa fa-solid fa-user-group" @click="rightDrawerState = !rightDrawerState" />
      </q-toolbar>
      <UserProfileDropdown/>
    </q-header>

    <q-drawer
      class="drawer"
      show-if-above
      v-model="leftDrawerState"
      side="left"
      bordered
    >
      <q-list>
        <q-item-label header>
          Channels
        </q-item-label>

        <Channel
          v-for="channel in channels"
          :key="channel.id"
          v-bind="channel"
        />

      </q-list>
    </q-drawer>

    <q-drawer
      class="drawer"
      show-if-above
      v-model="rightDrawerState"
      side="right"
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Users
        </q-item-label>

        <User
          v-for="user in users"
          :key="user.id"
          v-bind="user"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import Channel from 'components/Channel.vue'
import User from 'components/User.vue'
import UserProfileDropdown from 'components/UserProfileDropdown.vue'
import { defineComponent } from 'vue'

const userList = [
  {
    id: 0,
    firstName: 'Arnost',
    lastName: 'Kabel',
    nickname: 'kablis',
    email: 'arnost@kabel.com',
    notificationType: 'all',
    state: 'online'
  },
  {
    id: 1,
    firstName: 'Janko',
    lastName: 'Petrzlen',
    nickname: 'petrzlak',
    email: 'janko@petrzlen.com',
    notificationType: 'all',
    state: 'dnd'
  },
  {
    id: 2,
    firstName: 'Pelel',
    lastName: 'Petrovsky',
    nickname: 'pele',
    email: 'pelel@petrovsky.com',
    notificationType: 'all',
    state: 'offline'
  }
]

export default defineComponent({
  name: 'MainLayout',
  components: {
    Channel,
    User,
    UserProfileDropdown
  },

  computed: {
    leftDrawerState: {
      get () {
        return this.$store.state.mainStore.leftDrawerState
      },
      set (val: boolean) {
        this.$store.commit('mainStore/updateLeftDrawerState', val)
      }
    },
    rightDrawerState: {
      get () {
        return this.$store.state.mainStore.rightDrawerState
      },
      set (val: boolean) {
        this.$store.commit('mainStore/updateRightDrawerState', val)
      }
    }
  },
  data () {
    return {
      channels: this.$store.state.userStore.channels,
      users: userList
    }
  }
})

</script>

<style>
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #555;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #eee;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #afafaf;
}

.drawer {
  background-color: #393e46;
}
</style>
