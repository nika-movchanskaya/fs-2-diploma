import { SessionForTimeline } from "../../session/model/SessionForTimeline"

export interface HallWithTimeline {
    hall_id: number,
    name: string,
    sessions: SessionForTimeline[]
}
