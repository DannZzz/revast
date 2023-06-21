import { createRoot, createSignal } from "solid-js"

const createSettingsState = () => {
  const [webLoaded, setWebLoaded] = createSignal(false)

  return {
    webLoaded,
    setWebLoaded,
  }
}

export default createRoot(createSettingsState)
