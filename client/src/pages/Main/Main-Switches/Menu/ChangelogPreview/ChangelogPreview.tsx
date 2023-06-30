import { useNavigate } from "@solidjs/router"
import "./ChangelogPreview.scss"

const ChangelogPreview = () => {
  const navigate = useNavigate()
  function navTo(to: string) {
    navigate(to)
  }
  return (
    <div onClick={() => navTo("/changelog")} class="changelog-preview">
      <span class="title rainbow">CHANGELOG</span>
      <img
        crossorigin="anonymous"
        src="/images/peasant-preview.png"
        alt=""
        class="preview"
      />
    </div>
  )
}

export default ChangelogPreview
