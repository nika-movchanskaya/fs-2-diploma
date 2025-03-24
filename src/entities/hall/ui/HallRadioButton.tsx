import { Hall } from "../model/Hall"

export const HallRadioButton = (props: {hall: Hall, hallId: any, setHallId: any}) => {
    const {hall, hallId, setHallId } = props;

    return (
        <li>
            <input 
                type="radio" 
                className="conf-step__radio" 
                name="prices-hall" 
                value={hall.id}
                checked={hallId === hall.id} 
                onChange={() => setHallId(hall.id)}
            />
            <span className="conf-step__selector">{hall.name}</span>
        </li>
    )
}
