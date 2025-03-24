import { Hall } from "../model/Hall"

export const HallElem = (props: {hall: Hall, handleDelete: (id: number) => void}) => {
    const {hall, handleDelete} = props;

    return (
        <li>{hall.name}
            <button className="conf-step__button conf-step__button-trash" onClick={()=>{handleDelete(hall.id)}}></button>
        </li>
    )
}
