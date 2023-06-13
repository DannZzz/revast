import axios from "axios"
import { CompactItem, Craft, Highscore, ServerInformation } from "./type"

export const getServers = async (): Promise<ServerInformation[]> => {
  const headers = new Headers()
  headers.set("Access-Control-Allow-Origin", "*")
  try {
    const res = await fetch(`/api/servers`, { credentials: "include" })
    return await res.json()
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
