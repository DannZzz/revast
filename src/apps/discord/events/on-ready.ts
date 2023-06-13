import { Client } from 'discord.js'
import loadDJCommands from '../handlers/command'
export const onDiscordReady = async (client: Client) => {
  client.on('ready', () => {
    console.log(`${client.user.tag} is ready!`)
    loadDJCommands()
  })
}
