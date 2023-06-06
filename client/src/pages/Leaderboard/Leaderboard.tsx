import { For, createEffect, createResource, createSignal } from "solid-js"
import "./Leaderboard.scss"
import { HighscoreFilterOptions, getHighscores } from "../../api/requests"
import SwitchLabel, {
  SwitchLabelOption,
} from "../../components/SwitchLabel/SwitchLabel"
import {
  dateFilterOptions,
  modeSwitchOptions,
  typeFilterOptions,
} from "./switch-options"
import { createStore } from "solid-js/store"
import { Highscore } from "../../api/type"
import { formatNumber } from "anytool"

const Leaderboard = () => {
  const [filterOptions, setFilterOptions] = createStore<HighscoreFilterOptions>(
    { beta: false, date: "last-day", type: "xp" }
  )

  const [data, setData] = createSignal<Highscore[]>([])

  function changeMode(id: any) {
    setFilterOptions("beta", id === "beta")
  }

  function changeDate(id: any) {
    setFilterOptions("date", id)
  }

  function changeType(id: any) {
    setFilterOptions("type", id)
  }

  createEffect(() => {
    getHighscores(filterOptions).then((data) => {
      setData(data)
    })
  })

  return (
    <div class="leaderboard">
      <div class="container">
        <div class="controllers">
          <SwitchLabel
            onChange={(id) => changeMode(id)}
            minimumCheckeds={1}
            options={modeSwitchOptions}
          />
          <SwitchLabel
            onChange={(id) => changeDate(id)}
            checkedColor="#C3560E"
            minimumCheckeds={1}
            options={dateFilterOptions}
          />
          <SwitchLabel
            onChange={(id) => changeType(id)}
            checkedColor="#263F9D"
            minimumCheckeds={1}
            options={typeFilterOptions}
          />
        </div>
        <div class="list">
          <For each={data()}>
            {(highscore, i) => (
              <div class="highscore">
                <span class="rank">#{i() + 1}</span>
                <span class="name">{highscore.name}</span>
                <span class="stats">
                  {formatNumber(highscore.xp)} xp |{" "}
                  {formatNumber(highscore.days)} days
                </span>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
