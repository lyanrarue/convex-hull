import './Aide.css'
import { Stage, Layer, Rect, Circle, Line } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import { Point, CanvasState } from '../../utils/types/DataTypes';
import quickHull from '../../utils/model/QuickHull';
import Pseudocode from './Pseudocode/Pseudocode';
import { EventType, HullEvent } from '../../utils/types/Event';


/**
 * Defines the Aide component. This manages the canvas and pseudocode's live 
 * execution of the Quickhull animation 
 * @returns The HTML component for the interactive canvas and the pseudocode
 */
const Aide = () => {

  // define initial empty arrays with typing to manage state
  const initialCircles: any = []
  const initialLines: any = []
  const initialPoints: Point[] = []
  const initialEventQueue: HullEvent[] = []
  const initialHistory: CanvasState[] = []

  // initializes an empty list of canvas line elements
  const [lines, setLines] = useState(initialLines)
  // initializes an empty list of canvas circle elements
  const [circles, setCircles] = useState(initialCircles)
  // initializes an empty list of point objects
  const [points, setPoints] = useState(initialPoints)
  // initializes an empty event queue
  const [eventQueue, setEventQueue] = useState(initialEventQueue)
  // initializes the event index
  const [eventIndex, setEventIndex] = useState(-1)
  // defines an empty object for the special case event (all points on side of AB)
  const [drawAB, setDrawAB] = useState({a: null, b: null})
  // defines an initial hhistory list
  const [history, setHistory] = useState(initialHistory)
  // sets a flag indicating the direction of the animation step
  const [forward, setForward] = useState(true)

  /**
   * Adds a point and an associated canvas circle at the event's specified (x,y)
   * @param event the mouse event indicating a canvas click
   */
  const placePoint = (event: any) => {
    // if the animation is in progress, ignore click, otherwise allow click
    if (eventIndex === -1) {
      const x = event.evt.layerX
      const y = event.evt.layerY
  
      // add new circle to state
      const tempCircles = circles.slice()
      tempCircles.push(<Circle x={x} y={y} radius={5} fill="black"/>)
      setCircles(tempCircles)
  
      // add new points to state
      const tempPoints = points.slice()
      tempPoints.push({x, y})
      setPoints(tempPoints)
    }
  }

  /**
   * Adds and removes lines with endpoints specified.
   * @param addStartPoints The start points of the lines to add
   * @param addEndPoints  The end points of the lines to add
   * @param removeA The start point of the line to remove
   * @param removeB The end point of the line to remove
   */
  const addAndRemoveLines = (addStartPoints: Point[], addEndPoints: Point[], removeA?: Point, removeB?: Point) => {
    
    const tempLines = lines.slice()

    // add the lines specified
    for (let i = 0; i < addStartPoints.length; i++) {
      if (findLineIndex(tempLines, addStartPoints[i], addEndPoints[i]) === -1) {
        tempLines.push(<Line points={[addStartPoints[i].x, addStartPoints[i].y, addEndPoints[i].x, addEndPoints[i].y]} stroke={'green'}/>)
      } 
    }

    // if removal arguments are provided, find the associated line and remove it 
    if (removeA && removeB && points.length > 3) {
      const index = findLineIndex(tempLines, removeA, removeB)
      if (index !== -1) {
        tempLines.splice(index, 1)
      }
    }

    setLines(tempLines)
  }

  /**
   * Update circles at the given indices to the specified color
   * @param indices A list of indices corresponding to the circle position in   
   * the circles list
   * @param color The color to update the circles 
   */
  const updateCircleColors = (indices: number[], color: string) => {
    let tempCircles = circles.slice()

    // update circles at the indices provided and update the circles list
    indices.forEach(i => {
      let circle = tempCircles[i]
      tempCircles[i] = <Circle x={circle.props.x} y={circle.props.y} radius={circle.props.radius} fill={color}/>
    })
    setCircles(tempCircles)
  }

  /**
   * Resets various state that controls the animation / canvas
   */
  const resetCanvas = () => {
    // clear out all lines
    setLines([])
    // update all circles colors back to black
    const indices = points.map((p, i) => i)
    updateCircleColors(indices, 'black')
    // reset animation
    setEventIndex(-1)
    // reset special case
    setDrawAB({a: null, b: null})
    // reset animation direction to forward
    setForward(true)
    // reset history
    setHistory([])
  }

  /**
   * Clears out the entire canvas and resets all animations
   */
  const clearData = () => {
    // remove all points from the plane
    setCircles([])
    setPoints([])
    // remove all lines
    setLines([])
    // reset animation
    setEventIndex(-1)
    // reset special case
    setDrawAB({a: null, b: null})
    // reset direction to forward
    setForward(true)
    // reset history
    setHistory([])
  }

  /**
   * Increments the animaton by one step
   */
  const nextStep = () => {
    // if the next step exists, increment
    if ((eventIndex + 1) < eventQueue.length) {
      setEventIndex(eventIndex + 1)
      setForward(true)
    }
  }

  /**
   * Decrements the animation by one step
   */
  const previousStep = () => {
    // if the previous step exists, decrement
    if ((eventIndex - 1) >= -1) {
      setEventIndex(eventIndex - 1)
      setForward(false)
    }
  }

  /**
   * Returns the index of a given point
   * @param point The point to locate
   * @returns The index of the point in the points list
   */
  const findPointIndex = (point: Point) => {
    return points.indexOf(point)
  }

  /**
   * Returns the index of the line associated with endpoints a,b
   * @param lines The list of lines to search
   * @param a The start point of the line
   * @param b The end point of the line
   * @returns The index of the line, or -1 if it does not exist
   */
  const findLineIndex = (lines: any, a: Point, b: Point) => {
    for (let i = 0; i < lines.length; i++) {
      let points = lines[i].props.points
      if (points.indexOf(a.x) !== -1 && points.indexOf(a.y) !== -1 && 
          points.indexOf(b.x) !== -1 && points.indexOf(b.y) !== -1) {
            return i
      }
    }
    return -1
  }

  /**
   * Stores the previous canvas state in the history list
   * @param canvasState A snapshot of the canvas's lines and circles
   */
  const updateHistory = (canvasState: CanvasState) => {
    const tempHistory = history.slice()
    tempHistory.push(canvasState)
    setHistory(tempHistory)
  }

  /**
   * For a given event, determine what the event entails and perform the proper 
   * canvas update
   * @param event The event that took place along algo execution
   * @returns If the event is undefined, return null
   */
  const forwardAnimate = (event: HullEvent) => {
    if (event === undefined) return;

    // if the animation step was a forward step, store the current state of the canvas in the history 
    //@ts-ignore
    if (forward) {
      updateHistory({lines: lines, circles: circles})
    }

    switch(event.eventType) {
      case EventType.FindMinMax:
        // color AB
        updateCircleColors([findPointIndex(event.points![0]), findPointIndex(event.points![1])], 'red')
        break;
      case EventType.DrawLine:
        // draw AB
        addAndRemoveLines([event.points![0]], [event.points![1]])
        break;
      case EventType.FindC:
        // color C
        updateCircleColors([findPointIndex(event.points![0])], 'red')
        addAndRemoveLines([event.points![1]], [event.points![2]])
        break;
      case EventType.Divide:
        // draw PC, draw CQ, remove PQ
        addAndRemoveLines([event.points![0], event.points![1]], [event.points![1], event.points![2]], event.points![0], event.points![2])
        break;
      case EventType.RecurseS2QH:
        // if all points are below the line, this causes a special animation case
        if (!event.removeLine) {
          //@ts-ignore
          setDrawAB({a: event.points![0], b: event.points![1]})
        }
        addAndRemoveLines([event.points![0]], [event.points![1]])
        break;
      case EventType.RecurseS1QH:
        addAndRemoveLines([event.points![0]], [event.points![1]])
        break;
      case EventType.NoPointReturn:
        // if special animation case is triggered, handle it on last step
        if (eventIndex === eventQueue.length - 1) {
          if (drawAB.a !== null && drawAB.b !== null) {
            //@ts-ignore
            addAndRemoveLines([drawAB.a], [drawAB.b])
          }
          
        }
        break;
    }
  }

  /**
   * Performs the reverse animation step by consuming the last item in the 
   * history list and setting the current canvas state to it.
   */
  const reverseAnimate = () => {

    const tempHistory = history.slice()

    // get the last canvas state from history and update the canvas to it
    const lastState = tempHistory.pop()
    setCircles(lastState?.circles)
    setLines(lastState?.lines)

    // update history to not have the last state any more
    setHistory(tempHistory)
  }

  // runs the quickHull algorithm any time a new point is added to the plane
  useEffect(() => {
    if (points.length >= 3) {
      const data = quickHull(points)
      setEventQueue(data!.eventQueue)
    }
  }, [points])

  // run the animate function every time the event index is updated
  useEffect(() => {
    if (forward) {
      forwardAnimate(eventQueue[eventIndex])
    } else {
      reverseAnimate()
    }
    
  }, [eventIndex])

  return(
    <>
    <div className="aide-container">
      <div className="left">
      <div className='canvas'>
        <Stage width={750} height={750} onMouseDown={placePoint}>
          <Layer>
            {circles}
            {lines}
          </Layer>
        </Stage>
      </div>
      <div className="btn-group" role="group">
        <button 
          type="button" 
          className="btn btn-secondary"  
          onClick={clearData}
          >
            Clear Points
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          // disable clear if animation is not in progress
          disabled = {eventIndex < 0}
          onClick = {e => {resetCanvas()}}
          >
            Reset Algorithm
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          // disable button if less than three points on canvas
          disabled={points.length < 3 || eventIndex == -1}
          onClick={e => previousStep()}
        >
          Previous Step
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          // disable button if less than three points on canvas
          disabled={points.length < 3}
          onClick={e => nextStep()}
        >
          Next Step
        </button>
      </div>
      </div>
      <div className="right">
        <Pseudocode event={eventQueue[eventIndex]}/>
    </div>
    </div>
    </>
  )
}

export default Aide;