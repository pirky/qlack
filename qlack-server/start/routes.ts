import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.logout').middleware('auth')
  Route.get('me', 'AuthController.me').middleware('auth')
}).prefix('auth')

Route.group(() => {
  Route.get('getAllUsers', 'UserController.getAllUsers')
  Route.post('declineInvite', 'UserController.declineInvite').middleware('auth')
  Route.post('updateNotification', 'UserController.updateNotification').middleware('auth')
}).prefix('user')

Route.group(() => {
  Route.get('getChannel/:channelName', 'ChannelController.getChannel').middleware('auth')
  Route.get('getUsers/:channelName', 'ChannelController.getUsers').middleware('auth')
  Route.get('channelNames', 'ChannelController.getChannelNames').middleware('auth')
  Route.post('createChannel', 'ChannelController.createChannel').middleware('auth')
  Route.post('isBanned', 'ChannelController.isBanned').middleware('auth')
  Route.post('isInvited', 'ChannelController.isInvited').middleware('auth')
}).prefix('channel')
