import { FilmTimelineAdmin } from "../../film/model/FilmTimelineAdmin"

export interface SessionForTimeline
{
    id: number,
    film: FilmTimelineAdmin,
    start_time: string
}
