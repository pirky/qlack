<template>
  <q-layout view="hHh LpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" alt="quasar white logo">
          </q-avatar>
          Qlack
        </q-toolbar-title>

        <q-btn dense flat round icon="fa fa-solid fa-user-group" @click="rightDrawerOpen = !rightDrawerOpen" />
      </q-toolbar>
    </q-header>

    <q-drawer
      class="drawer"
      show-if-above
      v-model="leftDrawerOpen"
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
      v-model="rightDrawerOpen"
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

const channelList = [
  {
    id: 0,
    title: 'First module-channel ever',
    is_private: false
  },
  {
    id: 1,
    title: 'Lipsum',
    is_private: true
  },
  {
    id: 2,
    title: 'Tunakto',
    is_private: false
  }
]

const userList = [
  {
    id: 0,
    first_name: 'Arnost',
    last_name: 'Kabel'
  },
  {
    id: 1,
    first_name: 'Janko',
    last_name: 'Petrzlen'
  },
  {
    id: 2,
    first_name: 'Pelel',
    last_name: 'Petrovsky'
  }
]

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    Channel,
    User
  },

  computed: {
    leftDrawerOpen: {
      get () {
        return this.$store.state.mainStore.leftDrawerState
      },
      set (val) {
        this.$store.commit('mainStore/updateLeftDrawerOpen', val)
      }
    },
    rightDrawerOpen: {
      get () {
        return this.$store.state.mainStore.rightDrawerState
      },
      set (val) {
        this.$store.commit('mainStore/updateRightDrawerOpen', val)
      }
    },
  },

  data () {
    return {
      rightDrawerOpen: false,
      channels: channelList,
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
  background: #EEEEEE;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.drawer {
  background-color: #393e46;
}
</style>
