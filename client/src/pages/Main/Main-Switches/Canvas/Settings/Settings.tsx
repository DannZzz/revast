import { Component } from "solid-js"
import "./Settings.scss"
import SwitchLabel, {
  SwitchLabelOption,
} from "../../../../../components/SwitchLabel/SwitchLabel"
import { socket } from "../../../../../socket/socket"
import { PlayerGraphics } from "../../../../../canvas/types/player.types"

const Settings: Component<{
  onChange: (settings: { graphics: number }) => void
}> = ({ onChange }) => {
  const local = +localStorage.getItem("graphics")

  const settings = {
    graphics:
      !isNaN(local) && local >= 0 && local <= 2 ? local : PlayerGraphics.high,
  }

  const graphicsOptions: SwitchLabelOption[] = [
    {
      id: 0,
      label: "Low",
      checked: settings.graphics === PlayerGraphics.low,
    },
    {
      id: 1,
      label: "Medium",
      checked: settings.graphics === PlayerGraphics.medium,
    },
    {
      id: 2,
      label: "High",
      checked: settings.graphics === PlayerGraphics.high,
    },
  ]

  const graphicsOnCheck: (id: string | number, value: boolean) => void = (
    id,
    val
  ) => {
    if (!val) return
    settings.graphics = +id
    localStorage.setItem("graphics", "" + id)
    socket.emit("settings", [+id])
    onChange?.(settings)
  }

  return (
    <div class="settings">
      <div class="settings-block">
        <span>Graphics</span>
        <SwitchLabel
          options={graphicsOptions}
          checkedColor="#f0cc00"
          onChange={graphicsOnCheck}
          minimumCheckeds={1}
        />
      </div>
    </div>
  )
}

export default Settings
