import { useContext } from "react";
import { MedsContext } from "../../context/MedsProvider";


export default function Reminder(props) {
    const {days, remindedTimes,
        handleTimeChange,
        handleAddTime,
        removeTime
    
    } = useContext(MedsContext)
    

console.log(props, "props")
    return(
        <div>
            {/* add form button */}
            {/* date and time */}
            {/* <input type="date" /> */}
            {/* check days checkboxes */}
            {/* select all days */}
            {/* option to add another time input */}
            {
                days.map(day => <>
                    <label>{day}</label>
                    <input type="checkbox"/>
                </>)
            }
            {remindedTimes.map((time, index) => (
                <input
                key={index}
                type="time"
                value={time}
                onChange={(event) => handleTimeChange(index, event.target.value)}
                />
            ))}

            <button onClick={handleAddTime}>Add Time</button>
            <button onClick={removeTime}>Remove Time</button>
        </div>
    )
}