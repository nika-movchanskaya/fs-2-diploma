import { HallTime } from "../../hall/model/HallTime"

export interface FilmWithHallTime {
    id: number,
    name: string,
    description: string,
    origin: string,
    duration: number,
    image: string,
    hallTimes: HallTime[] 
}
