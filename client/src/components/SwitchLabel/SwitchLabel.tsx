import { Component, For, createSignal } from "solid-js"
import "./SwitchLabel.scss"
import { createStore } from "solid-js/store"

export interface SwitchLabelOption {
  label: string
  id: number | string
  onCheck?: () => void
  checked?: boolean
}

export interface SwitchLabelProps {
  options: SwitchLabelOption[]
  onChange?: (id: number | string, value: boolean) => void
  multiple?: boolean
  minimumCheckeds?: number
  checkedColor?: string
}

const SwitchLabel: Component<SwitchLabelProps> = (props) => {
  const {
    options,
    checkedColor,
    onChange,
    multiple,
    minimumCheckeds = 0,
  } = props

  const [checked, setChecked] = createSignal<any[]>(
    options.filter((option) => option.checked).map((option) => option.id)
  )

  const toggleOption = (id: string | number) => {
    if (checked().includes(id) && checked().length - 1 >= minimumCheckeds) {
      setChecked(checked().filter((checkedId) => checkedId !== id))
      onChange?.(id, false)
    } else {
      const option = options.find((option) => option.id === id)
      if (!option) return
      if (multiple) {
        setChecked([...checked(), id])
      } else {
        setChecked([id])
      }
      option.onCheck?.()
      onChange?.(id, true)
    }
  }

  return (
    <div class="customCheckBoxHolder">
      <For each={options}>
        {(option) => {
          return (
            <>
              <input
                class="customCheckBoxInput"
                id={"sl-" + option.id}
                type="checkbox"
                checked={checked().includes(option.id)}
                onChange={[toggleOption, option.id]}
              />
              <label class="customCheckBoxWrapper" for={"sl-" + option.id}>
                <div
                  class="customCheckBox"
                  style={`
                --switch-bg: ${checkedColor || "#2d6737"};
                `}
                >
                  <div class="inner">{option.label}</div>
                </div>
              </label>
            </>
          )
        }}
      </For>
    </div>
  )
}

export default SwitchLabel
