import { Component, Match, Show, Switch, createEffect, on } from "solid-js"
import Menu from "./Main-Switches/Menu"
import GameOver from "./Main-Switches/GameOver/GameOver"
import { Transition } from "solid-transition-group"
import "./Main.css"
import gameState from "../../store/game-state"
import Canvas from "./Main-Switches/Canvas"

const Main: Component = () => {
  const { gs, playerEndedInfo } = gameState

  document.oncontextmenu = (e) => e.preventDefault()

  return (
    <div class="main w-[100vw] h-[100vh] flex justify-center items-center">
      <Show when={gs.gamePage !== "game"}>
        <div
          style={{ "background-image": `url(/images/lobby-bg.png)` }}
          class="-z-10 w-full h-full absolute bg-no-repeat bg-center bg-cover"
        ></div>
      </Show>
      <Transition name="slide-fade">
        <Switch>
          <Match when={gs.gamePage === "main"}>
            <Menu />
          </Match>
          <Match when={gs.gamePage === "game-over"}>
            <GameOver {...playerEndedInfo()} />
          </Match>
        </Switch>
      </Transition>
      <Canvas />
    </div>
  )
}

export default Main
