import { WsResponse } from '@nestjs/websockets'
import { Namespace, Server, Socket } from 'socket.io'
import { JoinPlayerDto } from 'src/dto/join-player.dto'
import { PlayerBarsEntity } from 'src/dto/player-bars.dto'
import { ActionableHolderEntity } from 'src/entities/actionable-holder.entity'
import { ActionableSettableDrawOptionsEntity } from 'src/entities/actionable-settable-draw-options.entity'
import { BioEntity } from 'src/entities/bio.entity'
import { CraftEntity } from 'src/entities/craft.entity'
import { DropEntity } from 'src/entities/drop.entity'
import { EquipmentEntity } from 'src/entities/equipment.entity'
import { ItemEntity } from 'src/entities/item.entity'
import { LeaderboardMemberEntity } from 'src/entities/leaderboard-member.entity'
import { MobDynamicEntity } from 'src/entities/mob-dynamic.entity'
import { OtherPlayersEntity } from 'src/entities/other-players.entity'
import { PlayerInformationEntity } from 'src/entities/player-information.entity'
import { PlayerItemsEntity } from 'src/entities/player-items.entity'
import { PlayerJoinedEntity } from 'src/entities/player-joined.entity'
import { StaticSettableEntity } from 'src/entities/static-settable.entity'
import { WearingEntity } from 'src/entities/wearing.entity'
import { NumberBoolean } from 'src/game/types/any.types'
import { Point, Size } from 'src/global/global'
import { ToggleKeys } from 'src/structures/toggle-options'

interface ServerToClientEvents {
  staticBios: (
    data: [biosToDraw: BioEntity[], bioIdsToRemove: string[]],
  ) => void
  staticSettables: (
    data: [
      settables: StaticSettableEntity[],
      staticSettablesToRemove: string[],
    ],
  ) => void
  clicking: (data: [isClicking: boolean, clickDuration: number]) => void
  joinServer: (data: [playerData: PlayerJoinedEntity]) => void
  playerPosition: (data: [point: Point, camera: Point]) => void
  playerBars: (bars: PlayerBarsEntity[]) => void
  playerItems: (
    data: [
      items: PlayerItemsEntity[],
      crafts: { items: CraftEntity[]; changed: boolean },
      space: number,
      bagUrl: string,
    ],
  ) => void
  playerEquipment: (
    data: [weapon: EquipmentEntity, timeout: NumberBoolean],
  ) => void
  playerWearing: (
    data: [wearing: WearingEntity, timeout: NumberBoolean],
  ) => void
  mobAttacked: (data: [id: string]) => void
  staticItemAttacked: (
    data: [id: string, theta: number, showHpAngle?: number],
  ) => void
  staticItemMode: (data: [settableId: string, modeIndex: number]) => void
  drops: (data: [toAdd: DropEntity[], toRemoveIds: string[]]) => void
  dropAttacked: (data: [dropId: string]) => void
  staticItemMiscellaneous: (
    data: [id: string, currentResources: number, type: string],
  ) => void
  playerDied: (data: [playerInformation: PlayerInformationEntity]) => void
  playerCraft: (
    data: [status: boolean, craftId: string, isBook?: boolean],
  ) => void
  dynamicItems: (
    data: [players?: OtherPlayersEntity, mobs?: MobDynamicEntity],
  ) => void
  playerBodyEffect: (data: [playerId: string, effectType: 'attacked']) => void
  setItemResponse: (data: [itemId: number, timeout: NumberBoolean]) => void
  leaderboard: (
    data: [
      members: LeaderboardMemberEntity[],
      currenPlayerXP: number,
      isCurrentPlayerAmongTop: boolean,
      kills: number,
    ],
  ) => void
  day: (data: [day: NumberBoolean]) => void
  playerMessage: (data: [id: string, content: string]) => void
  serverMessage: (data: [content: string]) => void
  actionableHolder: (
    data: [
      settableId: string,
      settableType: string,
      drawOptions: ActionableSettableDrawOptionsEntity,
      allow: number[] | null,
      holders: ActionableHolderEntity[],
    ],
  ) => void
  removeActionable: (data: [settableId: string]) => void
}

export interface ClientToServerEvents {
  autofood(data: [value: NumberBoolean]): void
  craftRequest(data: [craftId: string]): void
  clickItem(data: [number]): void
  joinServer(data: JoinPlayerDto): void
  mouseAngle(data: [angle: number, theta: number]): void
  toggles(data: ToggleKeys): void
  setItemRequest(data: [itemId: number]): void
  screenSize(data: [size: Size]): void
  dropRequest(data: [itemId: number, all: NumberBoolean]): void
  messageRequest(data: [content: string]): void
  requestChatStatus(data: [status: NumberBoolean]): void
  requestActionableHolder(
    data: [settableId: string, itemId: number, x10: boolean],
  ): void
  requestActionableHolderTake(data: [settableId: string, i: number]): void
}

export type MainServer = Namespace<ClientToServerEvents, ServerToClientEvents>
export type MainSocket = Socket<ClientToServerEvents, ServerToClientEvents>

export type EventHandler<
  EVENTS extends object,
  EVENT_NAME extends keyof EVENTS,
> = (...args: any[]) => WsResponse<EVENTS[EVENT_NAME]>

export type EventGateway<T extends Record<any, any>> = {
  [k in keyof T]: (...args: any[]) => void
}

export type EventData<K extends keyof ClientToServerEvents> = Parameters<
  ClientToServerEvents[K]
>[0]
