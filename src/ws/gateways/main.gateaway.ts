import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets'
import { Namespace } from 'socket.io'
import {
  ClientToServerEvents,
  EventData,
  EventGateway,
  MainSocket,
} from '../events/events'
import { TEST_GAME_SERVER } from 'src/constant'
import { JoinPlayerDto } from 'src/dto/join-player.dto'
import { NB } from 'src/utils/NumberBoolean'
import GameServers from 'src/servers/game-servers'
import { WsRateLimit } from '../WsRateLimit'
import { NumberBoolean } from 'src/game/types/any.types'
import config from 'config'

@WebSocketGateway({ namespace: 'ws/main', cors: { origin: '*' } })
// @WebSocketGateway({ namespace: 'ws/main', cors: { origin: [config.get("WEB")] } })
export class MainGateway
  implements
    EventGateway<ClientToServerEvents>,
    OnGatewayInit,
    OnGatewayDisconnect
{
  @WebSocketServer() private server: Namespace

  get gameServer() {
    return GameServers.get(this.server.name)
  }

  afterInit(server: any) {
    GameServers.set(this.server.name, TEST_GAME_SERVER(this.server))
  }

  handleDisconnect(client: MainSocket) {
    this.gameServer.disconnectPlayer(client.id)
  }

  @SubscribeMessage('requestActionableHolderTake')
  requestActionableHolderTake(
    @ConnectedSocket() client: MainSocket,
    @MessageBody() data: EventData<'requestActionableHolderTake'>,
  ): void {
    this.gameServer.to(client.id)?.actions.actionableTake(data)
  }

  @SubscribeMessage('requestActionableHolder')
  requestActionableHolder(
    @ConnectedSocket() client: MainSocket,
    @MessageBody() data: EventData<'requestActionableHolder'>,
  ): void {
    const player = this.gameServer.to(client.id)?.actions.actionableHold(data)
  }

  @SubscribeMessage('requestChatStatus')
  requestChatStatus(
    @ConnectedSocket() client: MainSocket,
    @MessageBody() data: EventData<'requestChatStatus'>,
  ): void {
    this.gameServer.to(client.id)?.chatStatus(NB.from(data[0]))
  }

  // @WsRateLimit(10, 10)
  @SubscribeMessage('messageRequest')
  messageRequest(
    @ConnectedSocket() client: MainSocket,
    @MessageBody() data: EventData<'messageRequest'>,
  ): void {
    this.gameServer.to(client.id)?.makeMessage(data[0])
  }

  // @WsRateLimit(4, 2)
  @SubscribeMessage('dropRequest')
  dropRequest(
    @ConnectedSocket() client: MainSocket,
    @MessageBody() data: EventData<'dropRequest'>,
  ): void {
    const player = this.gameServer.to(client.id)
    if (player) player.items.dropItem(data[0], NB.from(data[1]))
  }

  // @WsRateLimit(20, 3)
  @SubscribeMessage('autofood')
  autofood(
    @ConnectedSocket() client: MainSocket,
    @MessageBody() data: EventData<'autofood'>,
  ): void {
    const player = this.gameServer.to(client.id)
    if (player) player.settings.autofood(NB.from(data[0]))
  }

  // @WsRateLimit(15, 5)
  @SubscribeMessage('screenSize')
  screenSize(
    @ConnectedSocket() client: MainSocket,
    @MessageBody() data: EventData<'screenSize'>,
  ): void {
    const player = this.gameServer.to(client.id)
    if (player) player.camera.screenSize(data[0], player.point())
  }

  // @WsRateLimit(5, 2)
  @SubscribeMessage('setItemRequest')
  setItemRequest(
    @ConnectedSocket() client: MainSocket,
    @MessageBody() data: EventData<'setItemRequest'>,
  ): WsResponse<[number, NumberBoolean]> {
    const player = this.gameServer.to(client.id)
    if (!player) return
    return {
      data: [
        player.items.setItem(data[0]),
        NB.to(player.items.timeout.building > Date.now()),
      ],
      event: 'setItemResponse',
    }
  }

  // @WsRateLimit(10, 2)
  @SubscribeMessage('craftRequest')
  craftRequest(
    @ConnectedSocket() client: MainSocket,
    @MessageBody() data: EventData<'craftRequest'>,
  ): void {
    this.gameServer.to(client.id)?.items.craftItem(data[0])
  }

  // @WsRateLimit(20, 3)
  @SubscribeMessage('clickItem')
  clickItem(
    @ConnectedSocket() client: MainSocket,
    @MessageBody() data: EventData<'clickItem'>,
  ): void {
    this.gameServer.to(client.id)?.items.click(data[0])
  }

  @SubscribeMessage('mouseAngle')
  mouseAngle(
    @ConnectedSocket() client: MainSocket,
    @MessageBody() data: EventData<'mouseAngle'>,
  ): void {
    this.gameServer.to(client.id)?.setAngle(data[0], data[1])
  }

  @SubscribeMessage('toggles')
  toggles(
    @ConnectedSocket() client: MainSocket,
    @MessageBody() data: EventData<'toggles'>,
  ): void {
    this.gameServer.to(client.id)?.toggle.set(data)
  }

  // @WsRateLimit(3, 10)
  @SubscribeMessage('joinServer')
  joinServer(
    @ConnectedSocket() client: MainSocket,
    @MessageBody() joinPlayerDto: JoinPlayerDto,
  ): void {
    this.gameServer.joinPlayer({ ...joinPlayerDto, socketId: client.id })
  }
}
