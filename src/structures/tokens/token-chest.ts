import Chest from 'anytool/dist/Chest'
import { GameProps } from 'src/game/server'

export interface TokenData {
  playerId: number
  currentSocketId: string
  serverInfo: GameProps['information']
}

export const TokenChest = new Chest<string, TokenData>()

export const newPlayerLogin = (token: string, data: TokenData) => {
  TokenChest.set(token, data)
  // console.log(TokenChest)
  return data
}

export const tokenDataBySocketId = (socketId: string): TokenData | null => {
  return TokenChest.find((data) => data.currentSocketId === socketId) || null
}
