import { Type } from 'class-transformer'
import { VisualPlayerTemplateData } from 'src/data-templates/templates-types'

export class OtherPlayersEntity {
  players: VisualPlayerTemplateData[]
  toRemoveIds: string[]

  constructor(data: Partial<OtherPlayersEntity>) {
    Object.assign(this, data)
  }
}
