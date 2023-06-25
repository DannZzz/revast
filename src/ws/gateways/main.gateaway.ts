import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets'
import {
  ClientToServerEvents,
  EventData,
  EventGateway,
  MainServer,
  MainSocket,
} from '../events/events'
import { JoinPlayerDto } from 'src/dto/join-player.dto'
import { NB } from 'src/utils/NumberBoolean'
import GameServers from 'src/servers/game-servers'
import { WsRateLimit } from '../WsRateLimit'
import { NumberBoolean } from 'src/game/types/any.types'
import config from 'config'
import { Wss } from '../WS/WSS'
import { TEST_GAME_SERVER } from 'src/servers/test-server'

// @WebSocketGateway({ namespace: 'ws/main', cors: { origin: '*' } })
@WebSocketGateway({
  path: '/ws/main',
  maxPayload: 500 * 1024,
  cors: {
    origin: (origin, cb) => {
      const allowedOrigins = [config.get('WEB')]
      console.log('ws', origin, allowedOrigins)
      if (!origin || allowedOrigins.indexOf(origin) === -1) {
        cb(new Error('Not allowed by CORS'))
      } else {
        cb(null, true)
      }
    },
    allowedHeaders: `Access-Control-Allow-Origin: ${config.get('WEB')}`,
  },
  transports: ['websocket'],
})
export class MainGateway implements OnGatewayInit {
  @WebSocketServer() private server: MainServer

  get gameServer() {
    return GameServers.get(this.server.path)
  }

  afterInit(server: any) {
    this.server.clientList = {}
    GameServers.set(
      this.server.path,
      TEST_GAME_SERVER(new Wss(this.server, () => this.gameServer)),
    )
  }
}
