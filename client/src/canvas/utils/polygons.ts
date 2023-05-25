import { Point } from "../../global/init"

export function doPolygonsIntersect(a: Point[], b: Point[]) {
  var polygons = [a, b]
  var minA, maxA, projected, i, i1, j, minB, maxB

  for (i = 0; i < polygons.length; i++) {
    // for each polygon, look at each edge of the polygon, and determine if it separates
    // the two shapes
    var polygon = polygons[i]
    for (i1 = 0; i1 < polygon.length; i1++) {
      // grab 2 vertices to create an edge
      var i2 = (i1 + 1) % polygon.length
      var p1 = polygon[i1]
      var p2 = polygon[i2]

      // find the line perpendicular to this edge
      var normal = { x: p2.y - p1.y, y: p1.x - p2.x }

      minA = maxA = undefined
      // for each vertex in the first shape, project it onto the line perpendicular to the edge
      // and keep track of the min and max of these values
      for (j = 0; j < a.length; j++) {
        projected = normal.x * a[j].x + normal.y * a[j].y
        if (isUndefined(minA) || projected < minA) {
          minA = projected
        }
        if (isUndefined(maxA) || projected > maxA) {
          maxA = projected
        }
      }

      // for each vertex in the second shape, project it onto the line perpendicular to the edge
      // and keep track of the min and max of these values
      minB = maxB = undefined
      for (j = 0; j < b.length; j++) {
        projected = normal.x * b[j].x + normal.y * b[j].y
        if (isUndefined(minB) || projected < minB) {
          minB = projected
        }
        if (isUndefined(maxB) || projected > maxB) {
          maxB = projected
        }
      }

      // if there is no overlap between the projects, the edge we are looking at separates the two
      // polygons, and we know there is no overlap
      if (maxA < minB || maxB < minA) {
        return false
      }
    }
  }
  return true
}

function isUndefined(val: any) {
  return val === undefined || val === null
}

export const rectToPolygon = (point: Point, size: Size) => {
  return [
    point,
    new Point(point.x + size.width, point.y),
    new Point(point.x + size.width, point.y + size.height),
    new Point(point.x, point.y + size.height),
    point,
  ]
}
