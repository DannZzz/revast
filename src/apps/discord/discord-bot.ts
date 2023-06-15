import config from 'config'
// Create REST and WebSocket managers directly
import { Client, GatewayIntentBits } from 'discord.js'
import { onDiscordReady } from './events/on-ready'
import { onDiscordMessage } from './events/on-message'
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageTyping,
  ],
  allowedMentions: { parse: [] },
})

const token = <string>config.get('DISCORD_BOT_TOKEN')

onDiscordReady(client)
onDiscordMessage(client)

client.on('error', (e) => console.log('DISCORD_ERROR', e))

export default async function connectDiscordBot() {
  token
    ? client.login(token)
    : console.log('Creating discord bot was ignored ( no token )')
}
