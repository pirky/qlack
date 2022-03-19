import { Module } from 'vuex';
import { StateInterface } from '../index';
// @ts-ignore
import state, { MainStateInterface } from './state';
// @ts-ignore
import actions from './actions';
// @ts-ignore
import getters from './getters';
// @ts-ignore
import mutations from './mutations';

const mainStore: Module<MainStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default mainStore;
