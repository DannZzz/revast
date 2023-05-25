import axios from "axios"
import { ServerInformation } from "./type"

export const getServers = async (): Promise<ServerInformation[]> => {
  try {
    const res = await axios.get(`/api/servers`)
    return res.data
  } catch (e) {
    console.error(e)
    return []
  }
}
