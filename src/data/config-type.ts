import { SettableMode } from 'src/game/basic/item.basic'
import { Point, Size } from 'src/global/global'

export enum SpecialItemTypes {
  bridge = 'bridge',
  repair = 'repair',
  plot = 'plot',
}

export type EquipableItemVariant =
  | 'axe'
  | 'pickaxe'
  | 'spear'
  | 'sword'
  | 'hammer'
  | 'shovel'

export const DrawPosByType = {
  axe: new Point(-3, 92),
  pickaxe: new Point(0, 95),
  spear: new Point(100, 160),
  sword: new Point(60, 100),
  hammer: new Point(75, 100),
  shovel: new Point(60, 80),
}

export const RangeByType = {
  axe: 100,
  pickaxe: 100,
  sword: 105,
  spear: 170,
  hammer: 110,
  shovel: 90,
}

export const CraftDuration = {
  wood: 2,
  stone: 4,
  gold: 6,
  diamond: 8,
  amethyst: 10,
  ruby: 14,
  emerald: 26,
}

export const CraftGivingXP = {
  wood: 50,
  stone: 125,
  gold: 250,
  diamond: 800,
  amethyst: 1250,
  ruby: 3500,
  emerald: 6000,
}

export const EquipmentItemSize = {
  spears: new Size(200, 200),
  hammers: new Size(150, 150),
  others: new Size(120, 120),
}

export const WallDoorByResourceType = {
  wood: 1000,
  stone: 2000,
  gold: 3000,
  diamond: 3800,
  amethyst: 4200,
  ruby: 5000,
}

export const WallDoorCraftDuration = {
  wood: 5,
  stone: 7,
  gold: 9,
  diamond: 10,
  amethytst: 12,
  ruby: 14,
}

export const HelmetsDefenseByResourceType = {
  stone: [2, 8],
  gold: [3, 16],
  diamond: [5, 20],
  amethyst: [6, 28],
  ruby: [7, 32],
  emerald: [8, 40],
}

export const verifyItemOfTeam: SettableMode['verify'] = function (player) {
  return player.uniqueId === this.authorId
}
