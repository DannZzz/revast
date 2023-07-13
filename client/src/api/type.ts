export interface ServerInformation {
  name: string
  api: string
  players: number
}

export interface Craft {
  id: number
  state: { workbench?: boolean; fire?: boolean; water?: boolean }
  items: { duration: number; givesXp: number; required: Record<number, number> }
}

export interface CompactItem {
  id: number
  iconUrl: string
  name: string
  description: string
}

export interface Highscore {
  name: string
  xp: number
  days: number
  createdAt: number
  sub?: number
  beta: boolean
}

