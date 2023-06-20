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
  const [content, setContent] = createSignal<JSX.Element>(<span>Hello</span>)
  const [buttons, setButtons] = createSignal<ModalButton[]>([])
  const store = createMutable<ModalStore>({})

  const showModal = (options: {
    content: JSX.Element
    buttons?: ModalButton[]
    title?: JSX.Element | string
    onClose?: () => any
  }) => {
    const { content, buttons = [], onClose, title } = options

    batch(() => {
      setTitle(title)
      setContent(content)
      setButtons(buttons)
      store.onClose = onClose
      setOpen(true)
    })
  }

  const closeModal = () => {
    batch(() => {
      setTitle()
      setContent(<></>)
      setButtons([])
      store.onClose = null
      setOpen(false)
    })
  }

  return {
    title,
    store,
    open,
    setOpen,
    content,
    showModal,
    buttons,
    closeModal,
  }
}

export default createRoot(modalState)
