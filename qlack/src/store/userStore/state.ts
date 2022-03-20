export interface UserStateInterface {
  id: number
  firstName: string
  lastName: string
  nickname: string
  email: string
  notificationType: string
  state: string
}

function state (): UserStateInterface {
  return {
    id: 0,
    firstName: 'Arnost',
    lastName: 'Kabel',
    nickname: 'kablis',
    email: 'arnost@kabel.com',
    notificationType: 'all',
    state: 'online'
  }
}

export default state
