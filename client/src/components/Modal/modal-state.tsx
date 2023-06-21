import { JSX, batch, createRoot, createSignal } from "solid-js"
import { ButtonProps } from "../Button/Button"
import { createMutable, createStore } from "solid-js/store"

export type ModalButton = { closeOnClick?: true } & ButtonProps

export interface ModalStore {
  onClose?: () => any
}

const modalState = () => {
  const [open, setOpen] = createSignal(false)

  const [title, setTitle] = createSignal<string>()
  const [opacity, setOpacity] = createSignal<number>(1)
  const [content, setContent] = createSignal<JSX.Element>(<span>Hello</span>)
  const [buttons, setButtons] = createSignal<ModalButton[]>([])
  const store = createMutable<ModalStore>({})

  const showModal = (options: {
    content: JSX.Element
    buttons?: ModalButton[]
    title?: string
    opacity?: number
    onClose?: () => any
  }) => {
    const { content, buttons = [], onClose, title, opacity = 1 } = options

    batch(() => {
      setTitle(title)
      setOpacity(opacity)
      setContent(content)
      setButtons(buttons)
      store.onClose = onClose
      setOpen(true)
    })
  }

  const closeModal = () => {
    batch(() => {
      setTitle()
      setOpacity(1)
      setContent(<></>)
      setButtons([])
      store.onClose = null
      setOpen(false)
    })
  }

  return {
    title,
    store,
    opacity,
    open,
    setOpen,
    content,
    showModal,
    buttons,
    closeModal,
  }
}

export default createRoot(modalState)
