import { Chest } from 'anytool'
import { HOLD_USER_API_SECONDS } from 'src/constant'

const CollectedIps = new Chest<
  string,
  {
    createdAt: number
    inGame?: boolean
    requested?: boolean
    connections?: number
    lastConnection?: number
  }
>()

setInterval(() => {
  CollectedIps.forEach((data, key) => {
    if (
      !data.inGame &&
      Date.now() - data.createdAt > HOLD_USER_API_SECONDS * 1000
    )
      CollectedIps.delete(key)
  })
  // console.log('after deleting', CollectedIps)
}, 60 * 1000)

export default CollectedIps
