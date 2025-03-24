import { Film } from "../../film/model/Film"
import { Hall } from "../../hall/model/Hall"

export interface Session
{
    id: number,
    date: Date,
    film: Film,
    hall: Hall,
    start_time: string
}