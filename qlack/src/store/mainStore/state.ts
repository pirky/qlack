export interface MainStateInterface {
  leftDrawerState: boolean
  rightDrawerState: boolean
  createChannelDialog: boolean
}

function state (): MainStateInterface {
  return {
    leftDrawerState: false,
    rightDrawerState: false,
    createChannelDialog: false
  }
}

export default state
