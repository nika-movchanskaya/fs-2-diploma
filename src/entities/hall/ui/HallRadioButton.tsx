import { Hall } from "../model/Hall"

export const HallRadioButton = (props: {hall: Hall, hallId: any, updateHall: any, radioName: string}) => {
    const {hall, hallId, updateHall, radioName } = props;

    return (
        <li>
            <input 
                type="radio" 
                className="conf-step__radio"
                name={`prices-hall ${radioName}`} 
                value={hall.id}
                checked={hallId === hall.id} 
                onChange={() => updateHall(hall)}
            />
            <span className="conf-step__selector">{hall.name}</span>
        </li>
    )
}
