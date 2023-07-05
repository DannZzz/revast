import { For, Show } from "solid-js"
import "./Modal.scss"
import modalState from "./modal-state"
import directives from "../../directives/directives"
import Button from "../Button/Button"
import { Transition } from "solid-transition-group"

const { clickOutside, clickInside } = directives

const Modal = () => {
  const { open, setOpen, modal } = modalState

  function close() {
    setOpen(false)
    modal().onClose?.()
  }

  return (
    <Transition name="modal-scale">
      <Show when={open()}>
        <div class="modal-container">
          <div
            use:clickOutside={!modal().noCloseOutside && close}
            class="modal"
            style={
              modal().containerStyle
                ? modal().containerStyle
                : {
                    "background-image": `linear-gradient(to bottom, rgba(37, 37, 37, ${
                      modal().opacity
                    }), rgba(49, 49, 49, ${modal().opacity}))`,
                  }
            }
          >
            <div class="controllers">
              <Show when={!!modal().title}>
                <h2 class="modal-title">{modal().title}</h2>
              </Show>

              <Show when={!modal().noCloseButton}>
                <img
                  onClick={close}
                  src="/images/close.png"
                  alt=""
                  class="close controller"
                />
              </Show>
            </div>
            <div class="content">{modal().content}</div>
            <div class="buttons">
              <For each={modal().buttons}>
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
