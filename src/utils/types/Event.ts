import { Point } from "./DataTypes";

/**
 * This enum defines all of the possible discrete animation steps that take 
 * place while the Quickhull algrorithm runs.
 */
export enum EventType{
  FindMinMax,
  DrawLine,
  RecurseS1QH,
  RecurseS2QH,
  NoPointReturn,
  FindC,
  Divide,
  RecurseS1FH,
  RecurseS2FH
}

/**
 * This type defines the type of event to show for the animation, as well as 
 * any points that are affected by the event.
 */
export type HullEvent = {
  eventType: EventType
  points?: Point[]
  removeLine?: boolean
}
