import { Component } from "solid-js"
import { PlayerInformationDto } from "../../../../socket/events"
import gameState from "../../../../store/game-state"
import "./GameOver.scss"

const GameOver: Component<{} & PlayerInformationDto> = (props) => {
  const { setPage } = gameState

  return (
    <div class="game-over">
      <h1 class="">Unfortunetely you are a typical nab</h1>
      <div class="stats">
        <span>XP: {props.xp}</span>
        <span>Days: {props.days}</span>
      </div>
      <button onClick={() => setPage("main")} class="">
        Go Back
      </button>
    </div>
  )
}

export default GameOver
