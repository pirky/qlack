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
          Invitations
        </q-item-label>

        <Channel
          v-for="channel in invitedChannels"
          :key="channel.id"
          v-bind="channel"
        />

      </q-list>

      <q-separator/>

      <q-list>
        <div class="row vertical-middle justify-between">
          <q-item-label header>
            Channels
          </q-item-label>
          <q-btn
            class="q-ma-sm q-pt-none q-pb-none add_btn"
            icon="fa fa-solid fa-plus"
            size="0.5em"
            style="min-height: 0;"
            @click="showDialog()"
          />
        </div>

        <Channel
          v-for="channel in joinedChannels"
          :key="channel.id"
          v-bind="channel"
        />

      </q-list>

<!--      <div>-->
<!--        <q-btn color="purple" @click="showNotifFero" label="Petrzlak Tuna Kto Notification" />-->
<!--        <q-btn color="purple" @click="showNotifFero2" label="Pele Tuna Kto Notification" />-->
<!--        <q-btn color="purple" @click="showNotifJozo" label="Pele Else Notification" />-->
<!--      </div>-->

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
          v-for="user in orderedUserList"
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
import { useQuasar } from 'quasar'
import CreateChannel from 'components/CreateChannel.vue'
import { User as UserContract } from 'src/contracts'

const userList = [
  {
    id: 0,
    firstName: 'Arnost',
    lastName: 'Kabel',
    nickname: 'kablis',
    email: 'arnost@kabel.com',
    notificationType: 'all',
    activeState: 'online'
  },
  {
    id: 1,
    firstName: 'Janko',
    lastName: 'Petrzlen',
    nickname: 'petrzlak',
    email: 'janko@petrzlen.com',
    notificationType: 'all',
    activeState: 'dnd'
  },
  {
    id: 2,
    firstName: 'Pelel',
    lastName: 'Petrovsky',
    nickname: 'pele',
    email: 'pelel@petrovsky.com',
    notificationType: 'all',
    activeState: 'offline'
  },
  {
    id: 3,
    firstName: 'Pelel',
    lastName: 'Petrovsky',
    nickname: 'pele',
    email: 'pelel@petrovsky.com',
    notificationType: 'all',
    activeState: 'online'
  }
]

function compare (a: UserContract, b: UserContract) {
  if (a.nickname < b.nickname) {
    return -1
  }
  if (a.nickname > b.nickname) {
    return 1
  }
  return 0
}

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
    },

    invitedChannels () {
      if (this.$store.state.channels.channels) {
        const channels = Object.values(this.$store.state.channels.channels)
        return channels.filter(channel => channel.userState === 'invited')
      }
      return []
    },
    joinedChannels () {
      if (this.$store.state.channels.channels) {
        const channels = Object.values(this.$store.state.channels.channels)
        return channels.filter(channel => channel.userState === 'joined')
      }
      return []
    },

    orderedUserList () {
      const onlineUserList: Array<UserContract> = []
      const dndUserList: Array<UserContract> = []
      const offlineUserList: Array<UserContract> = []

      userList.forEach(function (user) {
        if (user.activeState === 'online') onlineUserList.push(user)
        if (user.activeState === 'dnd') dndUserList.push(user)
        if (user.activeState === 'offline') offlineUserList.push(user)
      })

      onlineUserList.sort(compare)
      dndUserList.sort(compare)
      offlineUserList.sort(compare)

      return [...onlineUserList, ...dndUserList, ...offlineUserList]
    }
  },

  data () {
    const $q = useQuasar()
    return {
      showDialog () {
        $q.dialog({
          component: CreateChannel,
          componentProps: {
            text: 'something'
          }
        }).onOk(() => {
          console.log('OK, ulozim channel')
        }).onCancel(() => {
          console.log('Cancel, nic neurobim')
        })
      },

      showNotifFero () {
        // if (!$q.appVisible) {
        $q.notify({
          // If longer, replace rest with ...
          message: 'MMMMMMMMM MMMMMMMMM MMMMMMMMMM...',
          caption: 'petrzlak #Tuna kto',
          color: 'accent',
          textColor: 'black',
          icon: 'fa fa-solid fa-message',
          group: '#Tuna kto',
          position: 'top',
          actions: [
            { label: 'Dismiss', color: 'primary', handler: () => { /* ... */ } }
          ]
        })
        // }
      },

      showNotifFero2 () {
        // if (!$q.appVisible) {
        $q.notify({
          // If longer, replace rest with ...
          message: 'aaaaaaMM...',
          caption: 'pele #Tuna kto',
          color: 'accent',
          textColor: 'black',
          icon: 'fa fa-solid fa-message',
          group: '#Tuna kto',
          position: 'top',
          actions: [
            {
              label: 'Dismiss',
              color: 'primary',
              handler: () => { /* ... */
              }
            }
          ]
        })
        // }
      },

      showNotifJozo () {
        // if (!$q.appVisible) {
        $q.notify({
          // If longer, replace rest with ...
          message: 'Totalne je toto druhá správa, ...',
          caption: 'pele #Else',
          color: 'accent',
          textColor: 'black',
          icon: 'fa fa-solid fa-message',
          group: '#Else',
          position: 'top',
          actions: [
            {
              label: 'Dismiss',
              color: 'primary',
              handler: () => { /* ... */
              }
            }
          ]
        })
        // }
      }
    }
  }
})

</script>

<style>
.add_btn:before {
  box-shadow: none;
}

.add_btn {
  min-height: 0;
  min-width: 0;
}
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
