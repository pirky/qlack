import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import User, { ActiveStates } from 'App/Models/User'

export default class UserController {
  public async changeUserState(
    { socket, auth }: WsContextContract,
    activeState: string,
    stateChangedAt: Date
  ) {
    const user = await User.query().where('id', auth.user!.id).firstOrFail()
    if (user) {
      if (activeState === ActiveStates.ONLINE) user.activeState = ActiveStates.ONLINE
      else if (activeState === ActiveStates.OFFLINE) user.activeState = ActiveStates.OFFLINE
      else if (activeState === ActiveStates.DND) user.activeState = ActiveStates.DND

      user.stateChangedAt = stateChangedAt

      await user.save()
      // broadcast user to other users in channel and to the user itself
      socket.nsp.emit('changeUserState', {
        nickname: user.nickname,
        activeState: user.activeState,
      })
      return true
    }
    return false
  }
}
