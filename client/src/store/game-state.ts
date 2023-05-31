import { batch, createRoot, createSignal } from "solid-js"
import { createStore } from "solid-js/store"
import { ServerInformation } from "../api/type"
import { connectWS, disconnectWS } from "../socket/socket"
import { PlayerInformationDto } from "../socket/events"

export interface GameState {
  token: () => string
  loaded: boolean
  nickname: string
  gamePage: "game-over" | "main" | "game"
  server: ServerInformation
}

const initialState: GameState = {
  token: () => localStorage.getItem("_"),
  loaded: false,
  nickname: localStorage.getItem("nickname"),
  gamePage: "main",
  server: null,
}

const createGameState = () => {
  const [started, setStarted] = createSignal(false)
  const [died, setDied] = createSignal(false)
  const [playerEndedInfo, setPlayerEndedInfo] =
    createSignal<PlayerInformationDto>({} as any)

  const [gs, setState] = createStore<GameState>(initialState)

  const setPage = (page: GameState["gamePage"]) => {
    setState("gamePage", page)
  }

  const startGame = (nickname: string, server: ServerInformation) => {
    localStorage.setItem("nickname", nickname)
    connectWS(server.api)
    batch(() => {
      setState({
        nickname: nickname,
        gamePage: "game",
        server,
      })
      setStarted(true)
      setDied(false)
    })
  }

  const leaveGame = (endedPlayer: PlayerInformationDto) => {
    batch(() => {
      setState({
        server: null,
        gamePage: "game-over",
      })
      setStarted(false)
      setDied(true)
      setPlayerEndedInfo(endedPlayer)
    })
  }

  return { gs, setPage, startGame, leaveGame, started, died, playerEndedInfo }
}

export default createRoot(createGameState)
