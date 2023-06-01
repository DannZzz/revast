import { Component, Show } from "solid-js"
import "./Nav.scss"
import gameState from "../../../store/game-state"

const Nav: Component = () => {
  const { gamePage } = gameState
  return (
    <Show when={gamePage() !== "game"}>
      <div class="nav">
        <div class="container">
          <div
            onClick={() => window.location.replace("/crafts")}
            class="nav-item"
          >
            <span>Crafts</span>
          </div>
        </div>
      </div>
    </Show>
  )
}

export default Nav
