import { SessionShort } from "../../session/model/SessionShort"

export interface HallTime {
    hall_id: number,
    name: string,
    sessions: SessionShort[]
}