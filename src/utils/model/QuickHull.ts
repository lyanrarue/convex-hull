import { Point } from "../types/DataTypes";
import { EventType, HullEvent } from "../types/Event";
import { distanceToC, getMinMaxIndices, isCLeft } from "./QuickHullHelpers";

/**
 * The recursive helper function, find a point C furthest from the segment PQ, 
 * adds C to the hull, forms a triangle between PC, PQ, and QC, and recurses on 
 * the points outside this triangle. 
 * @param Sk the set of points to analyze
 * @param P The left endpoint of the dividing segment
 * @param Q The right endpoint of the dividing segment
 * @param hull The current set of points comprising the hull
 * @param eventQueue The list of actions taken to produce the hull
 * @returns when Sk contains no points
 */
const findHull = (Sk: Point[], P: Point, Q: Point, hull: Point[], eventQueue: HullEvent[]) => {

  // if there are no points in the list, return
  if (Sk.length === 0) {
    eventQueue.push({eventType: EventType.NoPointReturn})
    return;
  }
  

  // find the furthest point from PQ and add it to the hull
  let C: Point = {x: 0, y: 0};
  let maxDistance = 0;
  Sk.forEach((point) => {
    if (point !== P && point !== Q) {
      const distance = distanceToC(P, Q, point)
      if (distance > maxDistance) {
        C = point
        maxDistance = distance
      }
    }
  })
  hull.push(C)
  eventQueue.push({eventType: EventType.FindC, points: [C, P, Q]})
  

  // split the points in Sk into those to the left and right of PQ
  eventQueue.push({eventType: EventType.Divide, points: [P, C, Q]})
  const s1: Point[] = []
  const s2: Point[] = []
  Sk.forEach((point) => {
    if (point !== P && point !==Q && point !== C) {
      if (isCLeft(P, C, point) === 1) {
        s1.push(point)
      }

      if (isCLeft(C, Q, point) === 1) {
        s2.push(point)
      }
    }
  })

  // Recurse on the set of points outside of the triangle formed by PQ, PC, CQ
  eventQueue.push({eventType: EventType.RecurseS1FH})
  findHull(s1, P, C, hull, eventQueue)
  eventQueue.push({eventType: EventType.RecurseS2FH})
  findHull(s2, C, Q, hull, eventQueue)

} 

/**
 * This is the main driver for the Quickhull algorithm. Finds the min and max 
 * points in the plane and begins recursing on the subset of points created 
 * between these points.
 * @param points The set of points to run the algorithm on
 * @returns The set of points on the hull and a list of events that occured to 
 * find the points
 */
const quickHull = (points: Point[]) => {

  const eventQueue: HullEvent[] = [] 

  let hull: Point[] = [];

  // convex hull not possible with less than three points in the plane
  if (points.length < 3) {
    return;
  }

  // find the left and rightmost points in the plane
  const {minIndex, maxIndex} = getMinMaxIndices(points)
  hull.push(points[minIndex])
  hull.push(points[maxIndex])
  eventQueue.push({eventType: EventType.FindMinMax, points: [points[minIndex], points[maxIndex]]})
  eventQueue.push({eventType: EventType.DrawLine, points: [points[minIndex], points[maxIndex]]})


  // divide points into those to the left and right of line
  const s1: Point[] = []
  const s2: Point[] = []
  points.forEach((p) => {
    if (p !== points[minIndex] && p !== points[maxIndex]) {
      if (isCLeft(points[minIndex], points[maxIndex], p) === 1) {
        s1.push(p)
      } else {
        s2.push(p)
      }
    }
  })


  // recurse on the points to the left and right of AB
  eventQueue.push({eventType: EventType.RecurseS1QH, points: [points[minIndex], points[maxIndex]]})
  findHull(s1, points[minIndex], points[maxIndex], hull, eventQueue)
  eventQueue.push({eventType: EventType.RecurseS2QH, points: [points[minIndex], points[maxIndex]], removeLine: s1.length === 0 ? false : true})
  findHull(s2, points[maxIndex], points[minIndex], hull, eventQueue)

  // return the set of points on the hull and a log of steps taken to get the answer
  return {hull, eventQueue}
}

export default quickHull;
