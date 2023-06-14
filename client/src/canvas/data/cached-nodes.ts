import Konva from "konva"

export const playerHighlight = new Konva.Circle({
  radius: 150,
  globalCompositeOperation: "destination-out",
  fill: "rgba(255,255,255)",
  stroke: "white",
}).cache()
