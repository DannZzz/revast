import { JSX, batch, createRoot, createSignal } from "solid-js"
import { ButtonProps } from "../Button/Button"
import { createMutable, createStore } from "solid-js/store"

export type ModalButton = { closeOnClick?: true } & ButtonProps

export interface ModalStore {
  onClose?: () => any
  opacity?: number
  content?: JSX.Element
  noCloseOutside?: boolean
  buttons?: ModalButton[]
  title?: string
  noCloseButton?: boolean
  containerStyle?: JSX.CSSProperties
}

const modalState = () => {
  const [open, setOpen] = createSignal(false)

  const [state, setState] = createSignal<ModalStore>()

  const showModal = (options: ModalStore) => {
    const {
      content,
      buttons = [],
      onClose,
      title = null,
      opacity = 1,
      noCloseButton = false,
      noCloseOutside = false,
      containerStyle = null,
    } = options

    batch(() => {
      setState({
        content,
        buttons,
        onClose,
        title,
        opacity,
        noCloseButton,
        noCloseOutside,
        containerStyle,
      })
      setOpen(true)
    })
  }

  const closeModal = () => {
    batch(() => {
      setOpen(false)
    })
  }

  return {
    modal: state,
    open,
    setOpen,
    showModal,
    closeModal,
  }
}

export default createRoot(modalState)
