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
  Route.post('acceptInvite', 'UserController.acceptInvite').middleware('auth')
  Route.post('declineInvite', 'UserController.declineInvite').middleware('auth')
}).prefix('user')

Route.group(() => {
  Route.get('getChannel/:channelName', 'ChannelController.getChannel').middleware('auth')
}).prefix('channel')
