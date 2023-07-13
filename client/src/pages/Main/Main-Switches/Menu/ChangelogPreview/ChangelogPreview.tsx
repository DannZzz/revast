import "./ChangelogPreview.scss"
import { PREVIEW_URL } from "../../../../../constants"

const ChangelogPreview = () => {
  return (
    <a href="/changelog" target="_blank" class="changelog-preview">
      {/* <span class="title rainbow">CHANGELOG</span> */}
      <img crossorigin="anonymous" src={PREVIEW_URL} alt="" class="preview" />
    </a>
  )
}

export default ChangelogPreview
