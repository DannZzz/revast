import { Component, For, Signal, createSignal, onCleanup } from "solid-js"
import "./Market.scss"
import { socket } from "../../../../../socket/socket"

interface MarketItem {
  icon: string
  ref?: HTMLInputElement
  cost?: number
  for?: number
  value: Signal<number>
}

// for 6. cost 1, for 8, cost 2
// (value - (value % for)) / for * cost

const Market: Component<{}> = () => {
  const max = 25
  const localString = localStorage.getItem("market")
  const local = localString ? JSON.parse(localString) : [1, 1, 1, 3, 5]

  const items: MarketItem[] = [
    {
      icon: "api/images/wood-icon.png",
      for: 1,
      cost: 3,
      value: createSignal(local?.[0] || 1),
    },
    {
      icon: "api/images/stone-icon.png",
      for: 1,
      cost: 4,
      value: createSignal(local?.[1] || 1),
    },
    {
      icon: "api/images/gold2.png",
      for: 1,
      cost: 3,
      value: createSignal(local?.[2] || 1),
    },
    {
      icon: "api/images/diamond1.png",
      for: 3,
      cost: 1,
      value: createSignal(local?.[3] || 3),
    },
    {
      icon: "api/images/amethyst1.png",
      for: 5,
      cost: 1,
      value: createSignal(local?.[4] || 5),
    },
  ]

  onCleanup(() => {
    localStorage.setItem(
      "market",
      JSON.stringify(items.map((item) => item.value[0]()))
    )
  })

  return (
    <div class="market-container">
      <div class="title-container">
        <img src="images/market-title.png" alt="" class="title" />
      </div>
      <div class="market">
        <For each={items}>
          {(item, index) => {
            return (
              <div class="market-item">
                <div class="icon-container">
                  <img src={item.icon} alt="" class="icon" />
                  <span class="result-count">
                    {((item.value[0]() - (item.value[0]() % item.for)) /
                      item.for) *
                      item.cost}
                  </span>
                </div>
                <div class="buttons">
                  <div
                    class="buy-btn"
                    onClick={() => {
                      socket.emit("market", [
                        index(),
                        ((item.value[0]() - (item.value[0]() % item.for)) /
                          item.for) *
                          item.cost,
                      ])
                    }}
                    classList={{ berry: index() === 0 }}
                  ></div>
                  <div class="input-container">
                    <input
                      onKeyDown={(e) => e.preventDefault()}
                      onChange={(e) => {
                        item.value[1](+e.target.value)
                      }}
                      type="number"
                      class="amount"
                      step={item.for}
                      min={item.for}
                      max={max * item.for}
                      value={item.value[0]()}
                    />
                  </div>
                </div>
              </div>
            )
          }}
        </For>

        {/* <div class="market-item">
          <div class="icon-container">
            <img src="api/images/wood-icon.png" alt="" class="icon" />
            <span class="result-count">0</span>
          </div>
          <div class="buttons">
            <div class="buy-btn berry"></div>
            <div class="input-container">
              <input
                ref={inputs[0]}
                type="number"
                class="amount"
                min={1}
                max={25}
                value="1"
              />
            </div>
          </div>
        </div>
        <div class="market-item">
          <div class="icon-container">
            <img src="api/images/stone_1.png" alt="" class="icon" />
            <span class="result-count">0</span>
          </div>
          <div class="buttons">
            <div class="buy-btn"></div>
            <div class="input-container">
              <input
                ref={inputs[1]}
                type="number"
                class="amount"
                min={1}
                max={25}
                value="1"
              />
            </div>
          </div>
        </div>
        <div class="market-item">
          <div class="icon-container">
            <img src="api/images/gold2.png" alt="" class="icon" />
            <span class="result-count">0</span>
          </div>
          <div class="buttons">
            <div class="buy-btn"></div>
            <div class="input-container">
              <input
                ref={inputs[2]}
                type="number"
                class="amount"
                min={1}
                max={25}
                value="1"
              />
            </div>
          </div>
        </div>
        <div class="market-item">
          <div class="icon-container">
            <img src="api/images/diamond1.png" alt="" class="icon" />
            <span class="result-count">0</span>
          </div>
          <div class="buttons">
            <div class="buy-btn"></div>
            <div class="input-container">
              <input
                ref={inputs[3]}
                type="number"
                class="amount"
                min={1}
                max={25}
                value="1"
              />
            </div>
          </div>
        </div>
        <div class="market-item">
          <div class="icon-container">
            <img src="api/images/amethyst1.png" alt="" class="icon" />
            <span class="result-count">0</span>
          </div>
          <div class="buttons">
            <div class="buy-btn"></div>
            <div class="input-container">
              <input
                ref={inputs[4]}
                type="number"
                class="amount"
                min={1}
                max={25}
                value="1"
              />
            </div>
          </div> 
        </div>*/}
      </div>
    </div>
  )
}

export default Market
