import axios from "axios"
import { CompactItem, Craft, Highscore, ServerInformation } from "./type"
import { PlayerSkinDto } from "../socket/events"

export const getServers = async (): Promise<ServerInformation[]> => {
  try {
    const res = await axios.get(`/api/servers`)
    return res.data
  } catch (e) {
    console.error(e)
    return []
  }
}

export const getCrafts = async (): Promise<Craft[]> => {
  try {
    const res = await axios.get(`/api/crafts/list`)
    return res.data
  } catch (e) {
    console.error(e)
    return []
  }
}

export const getCompactItems = async (): Promise<CompactItem[]> => {
  try {
    const res = await axios.get(`/api/crafts/items`)
    return res.data
  } catch (e) {
    console.error(e)
    return []
  }
}

export const sendCanvas = async (
  n: string,
  data: string
): Promise<CompactItem[]> => {
  try {
    await axios.post(`/api/players/canvas`, { n, data })
  } catch (e) {
    console.error(e)
    return []
  }
}

export interface HighscoreFilterOptions {
  date: string
  type: string
  beta: boolean
}

export const getHighscores = async (
  filter: HighscoreFilterOptions
): Promise<Highscore[]> => {
  try {
    const res = await axios.get(
      `/api/users/highscores${filter.beta ? "/beta" : ""}/${filter.date}/${
        filter.type
      }`
    )
    return res.data
  } catch (e) {
    console.log(e)
    return []
  }
}

export const getSkins = async (): Promise<PlayerSkinDto[]> => {
  try {
    const res = await axios.get(`/api/items/skins`)
    return res.data
  } catch (error) {
    console.log(error)
    return []
  }
}
