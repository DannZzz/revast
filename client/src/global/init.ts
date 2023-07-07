export class Point {
  x: number
  y: number

  constructor(point: Point)
  constructor(x: number, y: number)
  constructor(arg1: number | Point, arg2?: number) {
    if (typeof arg1 === "number") {
      this.x = arg1
      this.y = arg2
    } else {
      this.x = arg1.x
      this.y = arg1.y
    }
  }
}

export class Size {
  width: number
  height: number

  constructor(size: Size)
  constructor(width: number, height: number)
  constructor(arg1: number | Size, arg2?: number) {
    if (typeof arg1 === "number") {
      this.width = arg1
      this.height = arg2
    } else {
      this.width = arg1.width
      this.height = arg1.height
    }
  }
}

export type Classes = Point | Size

export const isValidClass = (obj: Classes): boolean => {
  if (!obj || typeof obj !== "object") return false
  if ("x" in obj && "y" in obj) {
    return !isNaN(obj.x) && !isNaN(obj.y)
  } else if ("width" in obj && "height" in obj) {
    return !isNaN(obj.width) && !isNaN(obj.height)
  }
}

export const combineClasses = <T extends Classes>(obj1: T, obj2: T): T => {
  if (!isValidClass(obj1) || !isValidClass(obj1)) return null
  if ("x" in obj1 && "y" in obj2) {
    return new Point(obj1.x + obj2.x, obj1.y + obj2.y) as any
  } else if ("width" in obj1 && "width" in obj2) {
    return new Size(obj1.width + obj2.width, obj1.height + obj2.height) as any
  }
}

function __<T extends new (...args: any[]) => any>(
  targetClass: T,
  obj: any
): obj is InstanceType<T> {
  return obj instanceof targetClass
}
