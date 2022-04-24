/*
|--------------------------------------------------------------------------
| Websocket events
|--------------------------------------------------------------------------
|
| This file is dedicated for defining websocket namespaces and event handlers.
|
*/

import Ws from '@ioc:Ruby184/Socket.IO/Ws'

// this is dynamic namespace, in controller methods we can use params.name
Ws.namespace('channels/:name')
  // .middleware('channel') // check if user can join given channel
  .on('loadMessages', 'MessageController.loadMessages')
  .on('addMessage', 'MessageController.addMessage')
  .on('changeUserState', 'UserController.changeUserState')
  .on('kickUser', 'ChannelController.kickUser')
  .on('joinExisting', 'ChannelController.joinExisting')

Ws.namespace('/')
  .on('inviteUser', 'ChannelController.inviteUser')
