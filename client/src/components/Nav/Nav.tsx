import { Component, Show } from "solid-js"
import "./Nav.scss"
import gameState from "../../store/game-state"
import { FaSolidUsers } from "solid-icons/fa"
import { Link, useNavigate, useParams, useSearchParams } from "@solidjs/router"

const Nav: Component = () => {
  const { gamePage } = gameState
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  function navTo(to: string) {
    navigate(to)
  }

  if (searchParams.nonav !== undefined) return null

  return (
    <Show when={gamePage() !== "game"}>
      <div class="nav">
        <div class="container">
          <div class="title">
            <div class="title-text" onClick={() => navTo("/")}>
              Revast
            </div>
          </div>

          <div class="nav-items">
            <div onClick={() => navTo("/leaderboard")} class="nav-item">
              <FaSolidUsers class="nav-icon" fill="yellow" />
              <span>Leaderboard</span>
            </div>
            <div onClick={() => navTo("/changelog")} class="nav-item">
              <span class="rainbow">Changelog</span>
            </div>
            <div onClick={() => navTo("/crafts")} class="nav-item">
              <span>Crafts</span>
            </div>
          </div>
        </div>
      </div>
    </Show>
  )
}

export default Nav
