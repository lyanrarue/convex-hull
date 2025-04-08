/**
 * Defines the components for a Point object, composed of two integers x and y.
 */
export interface Point {
    x: number,
    y: number
}

/**
 * Defines the components for a Line object, composed of two Points.
 */
export interface Line {
    start: Point
    end: Point
}

/**
 * Defines a discrete slice of the canvas's state by tracking all circles and 
 * lines on the canvas 
 */
export interface CanvasState {
    circles: any[],
    lines: any[]
  }