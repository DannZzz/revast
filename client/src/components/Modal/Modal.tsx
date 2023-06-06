import { For, Show } from "solid-js"
import "./Modal.scss"
import modalState from "./modal-state"
import directives from "../../directives/directives"
import Button from "../Button/Button"
import { Transition } from "solid-transition-group"

const { clickOutside, clickInside } = directives

const Modal = () => {
  const { open, content, setOpen, buttons, store } = modalState

  function close() {
    setOpen(false)
    store.onClose?.()
  }

  return (
    <Transition name="modal-scale">
      <Show when={open()}>
        <div class="modal-container">
          <div use:clickOutside={close} class="modal">
            <div class="controllers">
              <img
                onClick={close}
                src="/images/close.png"
                alt=""
                class="close"
              />
            </div>
            <div class="content">{content()}</div>
            <div class="buttons">
              <For each={buttons()}>
                {(buttonProps) => <Button {...buttonProps} />}
              </For>
            </div>
          </div>
        </div>
      </Show>
    </Transition>
  )
}

export default Modal
