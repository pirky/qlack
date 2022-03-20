export interface MainStateInterface {
  leftDrawerState: boolean
  rightDrawerState: boolean
}

function state (): MainStateInterface {
  return {
    leftDrawerState: false,
    rightDrawerState: false
  }
}

export default state
