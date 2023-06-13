import config from 'config'

export const name: string = config.get('DISCORD_BOT_NAME') || 'икс,x,х' //

export class MyName {
  static names = name.split(',').map((s) => s.toLowerCase().trim())

  static has(str: string | string[]): boolean {
    const _names = Array.isArray(str) ? str : [str]
    return _names.some((name) => this.names.includes(name))
  }

  static find(str: string | string[]): string {
    const _names = Array.isArray(str) ? str : [str]
    return _names.find((name) => this.names.includes(name))
  }
}
