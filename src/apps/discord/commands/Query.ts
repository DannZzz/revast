export class DJQuery {
  private data = <any>{}

  set(key: string, value: any): DJQuery {
    this.data[key] = value
    return this
  }

  has(key: string): boolean {
    return key in this.data
  }

  get<T extends any = any>(key: string): T
  get<T extends any = any>(key: string, ifNotExists: T): T
  get<T extends any = any>(key: string, ifNotExists?: T): T {
    return key in this.data ? this.data[key] : ifNotExists
  }

  remove(key: string): DJQuery {
    delete this.data[key]
    return this
  }

  clear(): DJQuery {
    this.data = {}
    return this
  }
}
