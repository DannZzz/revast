interface Size {
  width: number
  height: number
}

interface Point {
  x: number
  y: number
}

type NumberBoolean = 1 | 0

type TwoHandMode = {
  point?: Point
  size?: Size
  rotation?: number
}

type TwoHandModeNode = {
  itemNode?: TwoHandMode
  handNode?: TwoHandMode
}

export type VisualPlayerTemplateData = [
  id: string,
  name: string,
  x: number,
  y: number,
  icons: number[],
  skin: PlayerSkinTempalteData, // to do
  clickStatus: boolean,
  clickDuration: number,
  rotation: number,
  equipment: EquipmentTemplateData, // to do
  wearing: WearingTemplateData, // to do
  bagUrl: string,
]

export type PlayerSkinTempalteData = [
  name: string,
  index: number,
  url: string,
  handUrl: string,
]

export type EquipmentTemplateData = [
  url: string,
  range: number,
  drawPositionX: number,
  drawPositionY: number,
  startRotationWith: number,
  flip: boolean,
  width: number,
  height: number,
  toggleClicks: number,
  twoHandMode: {
    active?: TwoHandModeNode
    noActive?: TwoHandModeNode
  },
]

export type WearingTemplateData = [
  url: string,
  drawPositionX: number,
  drawPositionY: number,
  width: number,
  height: number,
]

export type MobTemplateData = [
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  angle: number,
  url: string,
  hurtUrl: string,
]

export type StaticSettableTemplateData = [
  id: string,
  x: number,
  y: number,
  rotation: number,
  url: number,
  iconUrl: number,
  width: number,
  height: number,
  currentMode: number,
  showHpRadius: number,
  showHpAngle: number,
  seedResourceResources: number,
  seedResourceMaxResources: number,
  noAttackedAnimation: NumberBoolean,
  modes: SettableModeTemplateData[],
  type: string,
  setMode: SetModeTemplateData,
]

export type SettableModeTemplateData = [
  url: string,
  cover: number,
  width: number,
  height: number,
]

export type SetModeTemplateData = [
  grid: boolean,
  offsetX: number,
  offsetY: number,
  itemSize: SetModeItemSizeTemplateData,
]

export type SetModeItemSizeTemplateData = [
  type: 'circle' | 'rect',
  radius: number,
  width: number,
  height: number,
]

export type BioTemplateData = [
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  type: string,
  url: string,
  currentResources: number,
  maxResources: number,
]

export type MiscTemplateData = [
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  url: string,
]

export type DropTemplateData = [
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  url: string,
  hurtUrl: string,
]
