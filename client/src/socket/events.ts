import { PlayerSkinName } from "../canvas/types/player.types"
import { StaticItemAddonName } from "../canvas/data/staticItemAddons"

export type PlayerBar =
  | "hp"
  | "hungry"
  | "temperature"
  | "h2o"
  | "o2"
  | "bandage-effect"

export type NumberBoolean = 0 | 1

export interface PlayerItemDto {
  quantity: number
  equiped: boolean
  item: ItemDto
}

export interface ItemDto {
  id: number
  url: string
  iconUrl: string
  craftDuration?: number
}

export interface PlayerBarsDto {
  bar: PlayerBar
  max: number
  current: number
}

export interface PlayerSkinDto {
  name: PlayerSkinName
  url: string
  handUrl: string
  index: number
}

export interface JoinPlayerDto {
  name: string
  screen: Size
  token: string
  recaptcha_token: string
  skin: number
}

export class PlayerJoinedDto {
  skin: PlayerSkinDto
  name: string
  player: { point: Point; angle: number; speed: number }
  screen: Point
  map: MapDto
  token: string
  id: string
  dayInfo: DayInfo
  timeout: [weapon: number, helmet: number, building: number]
}

export type TwoHandMode = {
  point?: Point
  size?: Size
  rotation?: number
}

export type TwoHandModeNode = {
  itemNode?: TwoHandMode
  handNode?: TwoHandMode
}

export interface EquipmentDto {
  url: string
  flip?: boolean
  drawPosition: Point
  range: number
  size?: Size
  startRotationWith: number
  toggleClicks?: number
  twoHandMode?: {
    active?: TwoHandModeNode
    noActive?: TwoHandModeNode
  }
}

export interface MapDto {
  absoluteSize: Size
  tileSize: Size
  size: Size
  url: string
  biomes: Biome[]
}

export interface Biome {
  size: Size
  bgColor: string
  point: Point
}

export interface BioDto {
  type: string
  size: Size
  source: string
  id: string
  url: string
  point: Point
  maxResources?: number
  currentResources?: number
}

export interface VisualPlayerData {
  id: string
  point: Point
  skin: PlayerSkinDto
  rotation: number
  name: string
  clicking: { status: boolean; duration: number }
  equipment: EquipmentDto | null
  wearing: WearingDto | null
  bagUrl: string
}

export interface OtherPlayersDto {
  players: VisualPlayerData[]
  toRemoveIds: string[]
}

export interface StaticSettableDto {
  point: Point
  rotation: number
  id: string
  iconUrl: string
  size: Size
  setMode: SetMode
  currentMode: number
  modes: SettableModeDto[]
  type?: string
  highlight?: Highlight<HighlightType>
  showHp?: {
    radius: number
    angle: number
  }
  seedResource?: {
    resources: number
    maxResources: number
  }
}

export interface SettableModeDto {
  url: string
  cover: number
}

export interface SetMode {
  offset: Point
  itemSize: Size
}

export interface LeaderboardMemberDto {
  name: string
  xp: number
}

export interface PlayerInformationDto {
  xp: number
  days: number
}

export type HighlightType = "circle" | "rect"
export interface Highlight<T extends HighlightType> {
  type: T
  data: T extends "circle" ? { radius: number } : { point: Point; size: Size }
}

export interface DayInfo {
  thisDay: number
  oneDayDuration: number
  isDay: NumberBoolean
}

export interface MobDynamicDto {
  mobs: MobDto[]
  toRemoveIds: string[]
}

export interface MobDto {
  id: string
  point: Point
  size: Size
  angle: number
  url: string
  hurtUrl: string
}

export interface DropDto {
  id: string
  url: string
  point: Point
  size: Size
}

export interface WearingDto {
  url: string
  drawPosition: Point
  size: Size
}

export interface CraftDto {
  iconUrl: string
  id: string
  craftDuration: number
}

export interface ActionableHolderDto {
  quantity: number
  itemId: number
  iconUrl: string
  drawOffset: Point
  noBackground: boolean
  takeable: boolean
}

export interface ActionableSettableDrawOptionsDto {
  backgroundUrl: string
  size: Size
}

export enum WalkEffect {
  water,
}

export type PlyaerBodyEffect = "attacked"

export interface ClanVisualInformationDto {
  name: string
  joinable: boolean
  id: string
  memberCount: string
}

export interface ClanInformationDto {
  members: ClanMemberDto[]
  ownerId: string
  joinPrivacy: boolean
  name: string
  playerOwner: boolean
}

export interface ClanMemberDto {
  name: string
  id: string
  kickable: boolean
  owner: boolean
}

export interface ServerToClientEvents {
  staticBios: (
    data: [biosToDraw: BioDto[], staticIdsToRemove: string[]]
  ) => void
  staticSettables: (
    data: [settables: StaticSettableDto[], staticSettablesToRemove: string[]]
  ) => void
  clicking: (data: [isClicking: boolean, clickDuration: number]) => void
  joinServer: (data: [playerData: PlayerJoinedDto]) => void
  playerPosition: (data: [point: Point, camera: Point]) => void
  playerBars: (bars: PlayerBarsDto[]) => void
  playerItems: (
    data: [
      items: PlayerItemDto[],
      crafts: { items: CraftDto[]; changed: boolean },
      space: number,
      bagUrl?: string
    ]
  ) => void
  playerEquipment: (
    data: [weapon: EquipmentDto, timeout: NumberBoolean]
  ) => void
  playerWearing: (data: [weapon: WearingDto, timeout: NumberBoolean]) => void
  mobAttacked: (data: [id: string]) => void
  staticItemAttacked: (
    data: Array<[id: string, theta: number, showHpAngle?: number]>
  ) => void
  staticItemMode: (data: [settableId: string, mode: number]) => void
  drops: (data: [toAdd: DropDto[], toRemoveIds: string[]]) => void
  dropAttacked: (data: [dropId: string]) => void
  staticItemMiscellaneous: (
    data: [id: string, currentResources: number, type: StaticItemAddonName]
  ) => void
  playerDied: (data: [playerInformation: PlayerInformationDto]) => void
  playerCraft: (
    data: [status: boolean, craftId: string, isBook: boolean]
  ) => void
  dynamicItems: (
    data: [players?: OtherPlayersDto, mobs?: MobDynamicDto]
  ) => void
  playerBodyEffect: (
    data: [playerId: string, effectType: PlyaerBodyEffect]
  ) => void
  setItemResponse: (data: [itemId: number, timeout: NumberBoolean]) => void
  leaderboard: (
    data: [
      members: LeaderboardMemberDto[],
      currenPlayerXP: number,
      isCurrentPlayerAmongTop: boolean,
      kills: number
    ]
  ) => void
  day: (data: [day: NumberBoolean]) => void
  playerMessage: (data: [id: string, content: string]) => void
  serverMessage: (data: [content: string]) => void
  actionableHolder: (
    data: [
      settableId: string,
      settableType: string,
      drawOptions: ActionableSettableDrawOptionsDto,
      allow: number[] | null,
      holders: ActionableHolderDto[]
    ]
  ) => void
  removeActionable: (data: [settableId: string]) => void
  walkEffect: (
    data: [effect: WalkEffect, x: number, y: number, angle: number]
  ) => void
  clansInformation: (
    data: [
      visualClans?: ClanVisualInformationDto[],
      currentClan?: ClanInformationDto
    ]
  ) => void
  clanJoinApplication: (data: [memberName: string, memberId: string]) => void
}

export interface ClientToServerEvents {
  autofood(data: [value: NumberBoolean]): void
  craftRequest(data: [craftId: string]): void
  clickItem(data: [id: number]): void
  joinServer(data: [JoinPlayerDto]): void
  mouseAngle(data: [angle: number, theta: number]): void
  toggles(
    data: [
      up: NumberBoolean,
      down: NumberBoolean,
      right: NumberBoolean,
      left: NumberBoolean,
      clicking: NumberBoolean
    ]
  ): void
  setItemRequest(data: [itemId: number]): void
  screenSize(data: [size: Size]): void
  dropRequest(data: [itemId: number, all: NumberBoolean]): void
  messageRequest(data: [content: string]): void
  requestChatStatus(data: [status: NumberBoolean]): void
  requestActionableHolder(
    data: [settableId: string, itemId: number, x10: boolean]
  ): void
  requestActionableHolderTake(data: [settableId: string, i: number]): void
  requestClansInformation(data: []): void
  requestClanCreate(data: [name: string]): void
  requestClanJoin(data: [clanId: string]): void
  requestClanLeave(data: []): void
  requestClanMemberKick(data: [memberId: string]): void
  requestClanAcceptMember(data: [memberId: string]): void
  requestClanTogglePrivacy(data: []): void
}

export type MainSocket = WebSocket
