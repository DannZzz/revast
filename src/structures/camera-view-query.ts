import { Chest } from 'anytool'

const CameraViewQuery = new Chest<string, (dataUrl: string) => void>()

export default CameraViewQuery
