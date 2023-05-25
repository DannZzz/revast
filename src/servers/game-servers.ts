import { Chest } from 'anytool'
import { GameServer } from 'src/game/server'

const GameServers = new Chest<string, GameServer>()

export default GameServers
