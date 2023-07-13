import Aeolz from 'aeolz'
import {
  BioTemplateData,
  DropTemplateData,
  EquipmentTemplateData,
  MiscTemplateData,
  MobTemplateData,
  PlayerSkinTempalteData,
  SetModeItemSizeTemplateData,
  SetModeTemplateData,
  SettableModeTemplateData,
  StaticSettableTemplateData,
  VisualPlayerTemplateData,
  WearingTemplateData,
} from './templates-types'

export const PlayerSkinTemplate = new Aeolz.Template<PlayerSkinTempalteData>(
  ['name', 'index', 'url', 'handUrl'],
  { default: null },
)

export const EquipmentTemplate = new Aeolz.Template<EquipmentTemplateData>(
  [
    'url',
    'range',
    'drawPosition.x',
    'drawPosition.y',
    'startRotationWith',
    'flip',
    'width',
    'height',
    'toggleClicks',
    'twoHandMode',
  ],
  { default: null },
)

export const WearingTemplate = new Aeolz.Template<WearingTemplateData>(
  ['url', 'drawPosition.x', 'drawPosition.y', 'width', 'height'],
  { default: null },
)

export const VisualPlayerTemplate =
  new Aeolz.Template<VisualPlayerTemplateData>(
    [
      'id',
      'name',
      'point.x',
      'point.y',
      'icons',
      { key: 'skin', useTemplate: PlayerSkinTemplate },
      'clicking.status',
      'clicking.duration',
      'rotation',
      { key: 'equipment', useTemplate: EquipmentTemplate },
      { key: 'wearing', useTemplate: WearingTemplate },
      'bagUrl',
    ],
    {
      default: null,
    },
  )

export const MobTemplate = new Aeolz.Template<MobTemplateData>(
  [
    'id',
    'point.x',
    'point.y',
    'size.width',
    'size.height',
    'angle',
    'url',
    'hurtUrl',
  ],
  {
    default: null,
  },
)

export const SettableModeTemplate =
  new Aeolz.Template<SettableModeTemplateData>(
    ['url', 'cover', 'size.width', 'size.height'],
    { default: null },
  )

export const SetModeItemSizeTemplate =
  new Aeolz.Template<SetModeItemSizeTemplateData>(
    ['type', 'radius', 'width', 'height'],
    { default: null },
  )

export const SetModeTemplate = new Aeolz.Template<SetModeTemplateData>(
  [
    'grid',
    'offset.x',
    'offset.y',
    { key: 'itemSize', useTemplate: SetModeItemSizeTemplate },
  ],
  { default: null },
)

export const StaticSettableTemplate =
  new Aeolz.Template<StaticSettableTemplateData>(
    [
      'id',
      'point.x',
      'point.y',
      'rotation',
      'url',
      'iconUrl',
      'size.width',
      'size.height',
      'currentMode',
      'showHp.radius',
      'showHp.angle',
      'seedResource.resources',
      'seedResource.maxResources',
      'noAttackedAnimation',
      { key: 'modes', useTemplate: SettableModeTemplate, each: true },
      'type',
      { key: 'setMode', useTemplate: SetModeTemplate },
    ],
    { default: null },
  )

export const BioTemplate = new Aeolz.Template<BioTemplateData>(
  [
    'id',
    'point.x',
    'point.y',
    'size.width',
    'size.height',
    'type',
    'url',
    'currentResources',
    'maxResources',
  ],
  { default: null },
)

export const MiscTemplate = new Aeolz.Template<MiscTemplateData>(
  ['id', 'point.x', 'point.y', 'size.width', 'size.height', 'url'],
  { default: null },
)

export const DropTemplate = new Aeolz.Template<DropTemplateData>(
  ['id', 'point.x', 'point.y', 'size.width', 'size.height', 'url', 'hurtUrl'],
  { default: null },
)
