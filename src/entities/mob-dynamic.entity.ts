import { Type } from 'class-transformer'
import { MobEntity } from './mob.entity'

export class MobDynamicEntity {
  @Type(() => MobEntity)
  mobs: MobEntity[]
  toRemoveIds: string[]

  constructor(data: Partial<MobDynamicEntity>) {
    Object.assign(this, data)
  }
}
