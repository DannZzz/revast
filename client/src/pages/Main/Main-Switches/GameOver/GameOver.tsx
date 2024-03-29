import { Component } from "solid-js"
import { PlayerInformationDto } from "../../../../socket/events"
import gameState from "../../../../store/game-state"
import "./GameOver.scss"
import Button from "../../../../components/Button/Button"

const GameOver: Component<{} & PlayerInformationDto> = (props) => {
  const { setPage } = gameState

  return (
    <div class="game-over">
      <h1 class="">Ooops! Someone died hehe!</h1>
      <div class="stats">
        <span>XP: {props.xp}</span>
        <span>Days: {props.days}</span>
      </div>
      <Button onClick={() => setPage("main")}>Go Back</Button>
    </div>
  )
}

export default GameOver
