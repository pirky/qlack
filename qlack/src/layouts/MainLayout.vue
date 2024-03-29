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

        <q-btn v-if="activeChannel" dense flat round icon="fa fa-solid fa-user-group" @click="rightDrawerState = !rightDrawerState" />
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
            @click="showDialog(createChannel, this.$router, updateCreateChannelDialog)"
          />
        </div>

        <Channel
          v-for="channel in joinedChannels"
          :key="channel.id"
          v-bind="channel"
        />

      </q-list>

    </q-drawer>
    <q-drawer
      v-if="activeChannel"
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
          :key="user.nickname"
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
import { Channel as ChannelInterface } from 'src/contracts'

function userCompare (a: { nickname: string}, b: { nickname: string}) {
  if (a.nickname < b.nickname) {
    return -1
  }
  if (a.nickname > b.nickname) {
    return 1
  }
  return 0
}

function channelCompare (a: { name: string }, b: { name: string }) {
  if (a.name < b.name) {
    return -1
  }
  if (a.name > b.name) {
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
    activeChannel (): ChannelInterface {
      return this.$store.getters['channels/activeChannel'](
        this.$route.params.channelName
      )
    },
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

    invitedChannels (): ChannelInterface[] {
      if (this.$store.state.channels.channels) {
        const channels = Object.values(this.$store.state.channels.channels)
        return channels.filter(channel => channel.userState === 'invited').sort(channelCompare)
      }
      return []
    },
    joinedChannels (): ChannelInterface[] {
      if (this.$store.state.channels.channels) {
        const channels = Object.values(this.$store.state.channels.channels)
        return channels.filter(channel => channel.userState === 'joined').sort(channelCompare)
      }
      return []
    },

    orderedUserList () {
      const onlineUserList: Array<{ nickname: string, activeState: string}> = []
      const dndUserList: Array<{ nickname: string, activeState: string}> = []
      const offlineUserList: Array<{ nickname: string, activeState: string}> = []

      const userList = this.$store.state.channels.users

      userList?.forEach(function (user) {
        if (user.activeState === 'online') onlineUserList.push(user)
        if (user.activeState === 'dnd') dndUserList.push(user)
        if (user.activeState === 'offline') offlineUserList.push(user)
      })

      onlineUserList.sort(userCompare)
      dndUserList.sort(userCompare)
      offlineUserList.sort(userCompare)

      return [...onlineUserList, ...dndUserList, ...offlineUserList]
    }
  },

  data () {
    const $q = useQuasar()
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      showDialog (createChannel: any, router: any, updateCreateChannelDialog: any) {
        updateCreateChannelDialog(true)
        $q.dialog({
          component: CreateChannel,
          componentProps: {
            text: 'something'
          }
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
        }).onOk(async (data: {channelName: string, isPrivate: boolean}) => {
          const success = await createChannel(data.channelName, data.isPrivate)
          if (success) {
            router.push(`/channel/${data.channelName}`)
            $q.notify({
              message: `Channel ${data.channelName} created`,
              color: 'positive'
            })
          } else {
            $q.notify({
              message: `Channel ${data.channelName} already exists`,
              color: 'negative'
            })
          }
          updateCreateChannelDialog(false)
        }).onCancel(() => {
          updateCreateChannelDialog(false)
          console.log('cancel')
        })
      }
    }
  },

  methods: {
    createChannel (channelName: string, isPrivate: boolean) {
      return this.$store.dispatch('channels/createChannel', {
        channelName,
        isPrivate
      })
    },

    updateCreateChannelDialog (val: boolean) {
      void this.$store.dispatch('mainStore/updateCreateChannelDialog', val)
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
