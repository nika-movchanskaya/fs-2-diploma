import { Seat } from "../../seat/model/Seat"
import { Session } from "../../session/model/Session"

export interface Ticket {
    id: number,
    qr_code: string,
    session: Session,
    seat: Seat[]
}