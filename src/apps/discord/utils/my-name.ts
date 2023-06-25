import config from 'config'

export const name: string = config.get('DISCORD_BOT_NAME') || 'икс,x,х' //
const admins: string = config.get('ADMIN_DISCORD_IDS') || ''
const users: string = config.get('DISCORD_USERS') || ''
export class MyName {
  static names = name.split(',').map((s) => s.toLowerCase().trim())
  static admins = admins.split(',')
  static users = users.split(',')

  static has(str: string | string[]): boolean {
    const _names = Array.isArray(str) ? str : [str]
    return _names.some((name) => this.names.includes(name))
  }

  static find(str: string | string[]): string {
    const _names = Array.isArray(str) ? str : [str]
    return _names.find((name) => {
      const cleared = name.replace(/[0-9._/\/\-\@$%^&*()?!]*$/, '')
      return this.names.includes(cleared)
    })
  }
}
