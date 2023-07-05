import { Component, Show } from "solid-js"
import MenuCenter from "./Menu/MenuCenter"
import "./Menu.scss"
import { DISCORD_SERVER_LINK } from "../../../constants"
import Skins from "./Menu/Skins/Skins"
import ChangelogPreview from "./Menu/ChangelogPreview/ChangelogPreview"
import modalState from "../../../components/Modal/modal-state"

const Menu: Component<{}> = (props) => {
  const { open } = modalState

  return (
    <div class="menu">
      <MenuCenter />

      {/* <a href={DISCORD_SERVER_LINK} target="_blank" class="social discord">
        <img src="images/social-discord.png" />
      </a> */}
      <Show when={!open()}>
        <ChangelogPreview />
        <div class="footer">
          {/* <a style={{ "z-index": 10000 }} href="/terms?nonav" target="_blank">
          Terms of Service
        </a> */}
          <a target="_blank" href="/leaderboard" class="action-button lb"></a>
          <Skins />
          <a
            href={DISCORD_SERVER_LINK}
            target="_blank"
            class="action-button discord"
          ></a>
          <a target="_blank" href="/terms" class="action-button info"></a>
        </div>
      </Show>
    </div>
  )
}

export default Menu
