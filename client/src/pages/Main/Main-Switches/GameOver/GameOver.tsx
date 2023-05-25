import { Component } from "solid-js"
import { PlayerInformationDto } from "../../../../socket/events"
import gameState from "../../../../store/game-state"

const GameOver: Component<{} & PlayerInformationDto> = (props) => {
  const { setPage } = gameState

  return (
    <div class="flex flex-col justify-center items-center gap-5 p-5 bg-[#361f0d] rounded-lg text-[#ccc]">
      <h1 class="text-2xl">Unfortunetely you are a typical nab</h1>
      <div class="text-2xl flex flex-col justify-center items-center gap-2">
        <span>XP: {props.xp}</span>
        <span>Days: {props.days}</span>
      </div>
      <button onClick={() => setPage("main")} class="btn-primary">
        Go Back
      </button>
    </div>
  )
}

export default GameOver
