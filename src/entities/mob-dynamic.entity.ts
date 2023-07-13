import { Type } from 'class-transformer'
import { MobEntity } from './mob.entity'
import { MobTemplateData } from 'src/data-templates/templates-types'

export class MobDynamicEntity {
  mobs: MobTemplateData[]
  toRemoveIds: string[]

  constructor(data: Partial<MobDynamicEntity>) {
    Object.assign(this, data)
  }
}
