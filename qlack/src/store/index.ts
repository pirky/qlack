import { store } from 'quasar/wrappers'
import { InjectionKey } from 'vue'
import { createStore, Store as VuexStore, useStore as vuexUseStore } from 'vuex'

import mainStore from './mainStore'
import { MainStateInterface } from './mainStore/state'
import userStore from './userStore'
import { UserStateInterface } from './userStore/state'
import channelStore from './channelStore'
import { ChannelStateInterface } from './channelStore/state'

export interface StateInterface {
  mainStore: MainStateInterface,
  userStore: UserStateInterface,
  channelStore: ChannelStateInterface
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
      channelStore
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING
  })
})

export function useStore () {
  return vuexUseStore(storeKey)
}
