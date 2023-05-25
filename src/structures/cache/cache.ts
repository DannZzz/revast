export class Cache<T extends object> {
  data: Partial<T>
  constructor(private initialState: () => Partial<T>) {
    this.data = initialState()
  }

  has(key: keyof T) {
    return key in this.data
  }

  get<K extends keyof T>(key: K): T[K]
  get<K extends keyof T>(
    key: K,
    mapId: true,
  ): T[K] extends Array<{ id: string | number }> ? string[] : T[K]
  get<K extends keyof T>(key: K, mapId?: true): T[K] {
    const val = this.data[key]
    if (!val) return val
    if (mapId && Array.isArray(val)) {
      if (val.length > 0 && 'id' in val[0])
      return (val as any).map(i => i?.id)
    }
    return val
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
