import { WsResponse } from '@nestjs/websockets'
import {
  BioTemplateData,
  DropTemplateData,
  MiscTemplateData,
  StaticSettableTemplateData,
} from 'src/data-templates/templates-types'
import { JoinPlayerDto } from 'src/dto/join-player.dto'
import { PlayerBarsEntity } from 'src/dto/player-bars.dto'
import { ActionableHolderEntity } from 'src/entities/actionable-holder.entity'
import { ActionableSettableDrawOptionsEntity } from 'src/entities/actionable-settable-draw-options.entity'
import { BioEntity } from 'src/entities/bio.entity'
import { ClanInformationEntity } from 'src/entities/clan-information.entity'
import { ClanMemberEntity } from 'src/entities/clan-member.entity'
import { ClanVisualInformationEntity } from 'src/entities/clan-visual-information.entity'
import { CraftEntity } from 'src/entities/craft.entity'
import { DropEntity } from 'src/entities/drop.entity'
import { EquipmentEntity } from 'src/entities/equipment.entity'
import { ItemEntity } from 'src/entities/item.entity'
import { LeaderboardMemberEntity } from 'src/entities/leaderboard-member.entity'
import { MiscEntity } from 'src/entities/misc.entity'
import { MobDynamicEntity } from 'src/entities/mob-dynamic.entity'
import { OtherPlayersEntity } from 'src/entities/other-players.entity'
import { PlayerInformationEntity } from 'src/entities/player-information.entity'
import { PlayerItemsEntity } from 'src/entities/player-items.entity'
import { PlayerJoinedEntity } from 'src/entities/player-joined.entity'
import { StaticSettableEntity } from 'src/entities/static-settable.entity'
import { WearingEntity } from 'src/entities/wearing.entity'
import { NumberBoolean } from 'src/game/types/any.types'
import { WalkEffect } from 'src/game/types/player.types'
import { Point, Size } from 'src/global/global'
import { Timeout } from 'src/structures/timers/timeout'
import { ToggleKeys } from 'src/structures/toggle-options'
import * as WebSocket from 'ws'

export interface ServerToClientEvents {
  staticBios: (
    data: [biosToDraw: BioTemplateData[], bioIdsToRemove: string[]],
  ) => void
  staticSettables: (
    data: [
      settables: StaticSettableTemplateData[],
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
    data: Array<[id: string, theta: number, showHpAngle?: number]>,
  ) => void
  staticItemMode: (data: [settableId: string, modeIndex: number]) => void
  miscs: (data: [toAdd: MiscTemplateData[], toRemoveIds: string[]]) => void
  drops: (data: [toAdd: DropTemplateData[], toRemoveIds: string[]]) => void
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
  walkEffect: (
    data: [
      effect: WalkEffect,
      x: number,
      y: number,
      angle: number,
      playerId: string,
    ],
  ) => void
  clansInformation: (
    data: [
      visualClans?: ClanVisualInformationEntity[],
      currentClan?: ClanInformationEntity,
    ],
  ) => void
  clanJoinApplication: (data: [memberName: string, memberId: string]) => void
  requestCanvas: (data: [id: string]) => void
  icons: (data: number[]) => void
}

export interface ClientToServerEvents {
  autofood(data: [value: NumberBoolean]): void
  craftRequest(data: [craftId: string]): void
  clickItem(data: [id: number]): void
  joinServer(data: [JoinPlayerDto]): void
  mouseAngle(data: [angle: number, theta: number]): void
  toggles(data: ToggleKeys): void
  setItemRequest(data: [itemId: number, x: number, y: number, grid: boolean]): void
  screenSize(data: [size: Size]): void
  dropRequest(data: [itemId: number, all: NumberBoolean]): void
  messageRequest(data: [content: string]): void
  requestChatStatus(data: [status: NumberBoolean]): void
  requestActionableHolder(
    data: [settableId: string, itemId: number, x10: boolean],
  ): void
  requestActionableHolderTake(data: [settableId: string, i: number]): void
  requestClansInformation(data: []): void
  requestClanCreate(data: [name: string]): void
  requestClanJoin(data: [clanId: string]): void
  requestClanLeave(data: []): void
  requestClanMemberKick(data: [memberId: string]): void
  requestClanAcceptMember(data: [memberId: string]): void
  requestClanTogglePrivacy(data: []): void
  market(data: [i: number, quantity: number]): void
  settings(data: [type: number]): void
}

export type MainServer = WebSocket.Server & {
  clientList: Record<string, MainSocket>
}
export type MainSocket = WebSocket.WebSocket & {
  id: string
  inGame: boolean
  autodeleteTimeout: Timeout
  messagesPer5s: number
  ip: string
  requestToJoin: boolean
}

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
