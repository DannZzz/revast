import Konva from "konva"

const ITEM_ICON_EMPTY_BG = "#252525"
const ITEM_ICON_NOT_EMPTY_BG = "#397463"

export const makeItemIconBg = (options: {
  size: Size
  color?: string
  empty?: boolean
  id?: string
}) => {
  const { size, color = ITEM_ICON_NOT_EMPTY_BG, empty = false, id } = options

  return new Konva.Rect({
    id,
    fill: empty ? ITEM_ICON_EMPTY_BG : color,
    cornerRadius: 10,
    ...size,
    opacity: 0.7,
    shadowColor: "black",
    shadowBlur: 5,
    shadowOffset: { x: 0, y: 7 },
    shadowOpacity: 0.5,
  })
}

export const makeItemIconBgEmpty = (node: any) => {
  node.setAttr("fill", ITEM_ICON_EMPTY_BG)
}

export const makeItemIconBgNotEmpty = (node: any, color?: string) => {
  node.setAttr("fill", color || ITEM_ICON_NOT_EMPTY_BG)
}
