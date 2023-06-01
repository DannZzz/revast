import { Transform, instanceToPlain } from 'class-transformer'
import { SERVER_API } from 'src/constant'

export class Transformer {
  static toPlain(classObject: object): any {
    return instanceToPlain(classObject, { enableImplicitConversion: true })
  }
}

export function AssetLink() {
  return Transform(({ value }) =>
    typeof value === 'string' ? SERVER_API(`/api/images/${value}`) : value,
  )
}
