export interface MainStateInterface {
  leftDrawerState: boolean
  rightDrawerState: boolean
}

function state(): MainStateInterface {
  return {
    leftDrawerState: true,
    rightDrawerState: true
  };
}

export default state;
