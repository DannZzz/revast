import { Component, Match, Show, Switch, createEffect, on } from "solid-js"
import Menu from "./Main-Switches/Menu"
import GameOver from "./Main-Switches/GameOver/GameOver"
import { Transition } from "solid-transition-group"
import "./Main.scss"
import gameState from "../../store/game-state"
import Canvas from "./Main-Switches/Canvas/Canvas"
import Nav from "../../components/Nav/Nav"
import { Loader } from "./Loader/Loader"

const Main: Component = () => {
  const { gamePage, playerEndedInfo, loading } = gameState

  document.oncontextmenu = (e) => e.preventDefault()

  return (
    <>
      <div class="main">
        <Show when={gamePage() !== "game"}>
          <div class="game-bg "></div>
        </Show>
        <Transition name="slide-fade">
          <Switch>
            <Match when={gamePage() === "main"}>
              <Menu />
            </Match>
            <Match when={gamePage() === "game-over"}>
              <GameOver {...playerEndedInfo()} />
            </Match>
          </Switch>
        </Transition>
        <Canvas />
        <Show when={loading()}>
          <Loader />
        </Show>
      </div>
    </>
  )
}

export default Main
