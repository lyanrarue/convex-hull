import { useEffect} from 'react';
import { EventType, HullEvent } from '../../../utils/types/Event';
import './Pseudocode.css'

/**
 * Defines the props of the Pseudocode component
 */
interface PseudocodeProps {
  event?: HullEvent
}

/**
 * Defines the Pseudocode component, which contains a table of all pseudocode 
 * for the Quickhull algorithm.
 * @param props contains the current event to be highlighted in the table
 * @returns A table showing all of the pseudocode for the Quickhull algorithm
 */
const Pseudocode = (props: PseudocodeProps) => {

  // find the last row that was highlighted, if it exists
  let previous = document.getElementsByClassName("highlighted");

  // if a row was highlighted, unhighlight it
  if (previous.length >= 1) {
    previous[0].classList.remove("highlighted")
  }

  // if an event was passed in, highlight the row associated with the given event
  if (props.event) {
    let line = document.getElementById(props.event.eventType.toString())!
    line.classList.add("highlighted")
  }

  return (
    <table>
      <tbody>
        <tr>
          <td 
          >
            <b>QuickHull(S):</b>
          </td>
        </tr>
        <tr>
          <td 
          id={EventType.FindMinMax.toString()} 
          className="indent"
          >
            Find left and right most points A and B, add both to hull
          </td>
        </tr>
        <tr>
          <td 
          id={EventType.DrawLine.toString()} 
          className="indent" 
          >
            Draw segment AB, divide remaining points into S1 and S2 where S1 contains points on the right of AB and S2 contains those on the left
          </td>
        </tr>
        <tr>
          <td 
          id={EventType.RecurseS1QH.toString()} 
          className="indent"
          >
            FindHull(S1, A, B)
          </td>
        </tr>
        <tr>
          <td 
          id={EventType.RecurseS2QH.toString()}
          className="indent"
          >
            FindHull(S2, A, B)
          </td>
        </tr>
        <tr>
          <td
          >
            <b>FindHull(Sk, P, Q):</b>
          </td>
        </tr>
        <tr>
          <td 
          id={EventType.NoPointReturn.toString()} 
          className="indent"
          >
            If Sk has no point, return
          </td>
        </tr>
        <tr>
          <td 
          id={EventType.FindC.toString()} 
          className="indent"
          >
            Find furthest point, C, from the segment PQ and add to hull
          </td>
        </tr>
        <tr>
          <td 
          id={EventType.Divide.toString()} 
          className="indent"
          >
            Draw Segment PC and CQ. Divide points into S1 and S2, where S1 contains the points to the right of segment PC, and S2 contains the points to the right of segment CQ
          </td>
        </tr>
        <tr>
          <td 
          id={EventType.RecurseS1FH.toString()} 
          className="indent"
          >
            FindHull(S1, P, C)
          </td>
        </tr>
        <tr>
          <td 
          id={EventType.RecurseS2FH.toString()} 
          className="indent"
          >
            FindHull(S2, C, Q)
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default Pseudocode;