import { Hall } from "../../hall/model/Hall"
import { Seat } from "../../seat/model/Seat"

export interface SessionWithSeats
{
    id: number,
    date: Date,
    film: {
        id: number,
        name: string
    },
    hall: Hall,
    start_time: string,
    seats: Seat[]
}