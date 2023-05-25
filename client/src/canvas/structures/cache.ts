export class Cache<T extends object> {
  data: Partial<T>
  constructor(private initialState: () => Partial<T>) {
    this.data = initialState()
  }

  has(key: keyof T) {
    return key in this.data
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.data[key]
  }

  clear() {
    this.data = this.initialState()
    return this
  }

  propertyToInitialState(key: keyof T) {
    const init = this.initialState()
    this.data[key] = init[key]
    return this
  }
}
