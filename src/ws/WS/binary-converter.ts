import { BSON } from 'bson'
import { WsMessage } from './type'

export const binaryMessageToObject = (data: any) => {
  const convert = uintToString(data)
  if (!convert) return false
  return <WsMessage>JSON.parse(convert)
}

export const emitDataToBinary = (event: string, data: any) =>
  stringToUint(JSON.stringify({ event, data }))

function stringToUint(str: string) {
  var string = btoa(unescape(encodeURIComponent(str))),
    charList = string.split(''),
    uintArray = []
  for (var i = 0; i < charList.length; i++) {
    uintArray.push(charList[i].charCodeAt(0))
  }
  return new Uint8Array(uintArray)
}

function uintToString(uintArray) {
  try {
    var encodedString = String.fromCharCode.apply(null, uintArray),
      decodedString = decodeURIComponent(escape(atob(encodedString)))
    return decodedString
  } catch (e) {
    return false
  }
}
