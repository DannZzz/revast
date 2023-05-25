import { IsNumber } from 'class-validator'

export class Point {
  @IsNumber()
  public x: number
  @IsNumber()
  public y: number
  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  round() {
    return new Point(Math.round(this.x), Math.round(this.y))
  }

  clone() {
    return new Point(this.x, this.y)
  }
}

export class Size {
  @IsNumber()
  public width: number
  @IsNumber()
  public height: number
  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  round() {
    return new Size(Math.round(this.width), Math.round(this.height))
  }
  
  clone() {
    return new Size(this.width, this.height)
  }
}

export type Classes = Point | Size

export const isValidClass = (obj: Classes): boolean => {
  if (!obj || typeof obj !== 'object') return false
  if (obj instanceof Point) {
    return !isNaN(obj.x) && !isNaN(obj.y)
  } else if (obj instanceof Size) {
    return !isNaN(obj.width) && !isNaN(obj.height)
  }
}

export const combineClasses = <T extends Classes>(obj1: T, obj2: T): T => {
  if (!isValidClass(obj1) || !isValidClass(obj1)) return null
  if (__(Point, obj1) && __(Point, obj2)) {
    return new Point(obj1.x + obj2.x, obj1.y + obj2.y) as any
  } else if (__(Size, obj1) && __(Size, obj2)) {
    return new Size(obj1.width + obj2.width, obj1.height + obj2.height) as any
  }
}

function __<T extends new (...args: any[]) => any>(
  targetClass: T,
  obj: any,
): obj is InstanceType<T> {
  return obj instanceof targetClass
}
