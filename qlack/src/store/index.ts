import { store } from 'quasar/wrappers'
import { InjectionKey } from 'vue'
import { createStore, Store as VuexStore, useStore as vuexUseStore } from 'vuex'

import mainStore from './mainStore'
import { MainStateInterface } from './mainStore/state'
import userStore from './userStore'
import { UserStateInterface, MessageInterface, ChannelInterface } from './userStore/state'

import auth from './module-auth'
import type { AuthStateInterface } from './module-auth/state'

export interface StateInterface {
  mainStore: MainStateInterface,
  userStore: UserStateInterface,
  messageInterface: MessageInterface,
  channelInterface: ChannelInterface,
  auth: AuthStateInterface,
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> = Symbol('vuex-key')

export default store(function () {
  return createStore<StateInterface>({
    modules: {
      mainStore,
      userStore,
      auth
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING
  })
})

export function useStore () {
  return vuexUseStore(storeKey)
}
