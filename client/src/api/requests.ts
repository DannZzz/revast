import axios from "axios"
import { CompactItem, Craft, ServerInformation } from "./type"

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
