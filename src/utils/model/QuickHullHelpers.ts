import { Point } from "../types/DataTypes";

/**
 * Calculates the cross product of c with a and b. Returns 0 if c is collinear * to points a and b, 1 if c is clockwise of a and b, and -1 if c is
 * counterclockwise to a and b.
 * @param a The first point of the segment
 * @param b The second points of the segment
 * @param c The candidate point to check against ab
 * @returns 0 if c is collinear to points a and b, 1 if c is clockwise of a and 
 * b, and -1 if c is counterclockwise to a and b.
 */
export const isCLeft = (a: Point, b: Point, c: Point) => {
  const cross = ((c.x - a.x) * (b.y - a.y)) - ((c.y - a.y) * (b.x - a.x))
  return cross < 0 ? -1 : cross > 0 ? 1 : 0;
} 

/**
 * Returns the distance to c from ab. 
 * @param a the first point in the segment
 * @param b the second point in the segment
 * @param c the candidate point to find the distance to
 * @returns distance to c from ab
 */
export const distanceToC = (a: Point, b: Point, c: Point) => {
  return Math.abs(((c.x - a.x) * (b.y - a.y)) - ((c.y - a.y) * (b.x - a.x)))
}

/**
 * Iterates through a list of given points and returns the indices of the left  
 * and rightmost points in the list.
 * @param points a list of points in the plane
 * @returns the indices of the leftmost and rightmost points in the list
 */
export const getMinMaxIndices = (points: Point[]) => {
  let minIndex = 0;
  let maxIndex = 0;
  points.forEach((p, index) => {
    if (p.x > points[maxIndex].x) {
      maxIndex = index
    }
    if (p.x < points[minIndex].x) {
      minIndex = index
    }
  })

  return {minIndex, maxIndex}
}