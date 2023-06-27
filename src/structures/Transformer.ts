import {
  ClassTransformOptions,
  Transform,
  instanceToPlain,
} from 'class-transformer'
import { SERVER_API } from 'src/constant'
import { Images } from './image-base'

export class Transformer {
  static toPlain(
    classObject: object,
    options: ClassTransformOptions = {},
  ): any {
    return instanceToPlain(classObject, {
      enableImplicitConversion: true,
      ...options,
    })
  }

  toPlain() {
    return Transformer.toPlain(this) //
  }
}

export function AssetLink() {
  return Transform(({ value }) =>
    typeof value === 'string'
      ? SERVER_API(`/api/images/${value in Images ? Images[value] : value}`)
      : value,
  )
}
