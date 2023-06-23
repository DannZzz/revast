import { Accessor, batch, createRoot, createSignal } from "solid-js"
import { createStore } from "solid-js/store"
import { ServerInformation } from "../api/type"
import { connectWS, disconnectWS, socket } from "../socket/socket"
import { PlayerInformationDto } from "../socket/events"

export interface GameState {
  token: () => string
  recaptcha_token: string
  loaded: boolean
  nickname: string
  skin: number
  server: ServerInformation
}

const initialState: GameState = {
  token: () => localStorage.getItem("_"),
  skin: +localStorage.getItem("skin"),
  recaptcha_token: null,
  loaded: false,
  nickname: localStorage.getItem("nickname"),
  server: null,
}

const createGameState = () => {
  const [started, setStarted] = createSignal(false)
  const [died, setDied] = createSignal(false)
  const [loading, setLoading] = createSignal(false)
  const [playerEndedInfo, setPlayerEndedInfo] =
    createSignal<PlayerInformationDto>({} as any)

  const [gamePage, setPage] = createSignal<"game-over" | "main" | "game">(
    "main"
  )

  const [gs, setState] = createStore<GameState>(initialState)

  const startGame = (
    nickname: string,
    server: ServerInformation,
    recaptcha_token: string
  ) => {
    localStorage.setItem("nickname", nickname)
    connectWS(server.api)
    batch(() => {
      setState({
        recaptcha_token,
        nickname: nickname,
        server,
      })
      setStarted(true)
      setDied(false)
    })
  }

  const setSkin = (skin: number) => {
    setState("skin", skin)
    localStorage.setItem("skin", "" + skin)
  }

  const showGame = () => {
    batch(() => {
      setLoading(false)
      setPage("game")
    })
  }

  const leaveGame = (endedPlayer: PlayerInformationDto) => {
    batch(() => {
      setState({
        recaptcha_token: null,
        server: null,
      })
      setPage("game-over")
      setStarted(false)
      setDied(true)
      setPlayerEndedInfo(endedPlayer)
    })
  }

  return {
    gs,
    gamePage,
    setPage,
    startGame,
    leaveGame,
    started,
    died,
    playerEndedInfo,
    loading,
    setLoading,
    showGame,
    setSkin,
  }
}

export default createRoot(createGameState)
