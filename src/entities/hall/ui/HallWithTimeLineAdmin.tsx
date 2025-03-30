import { HallWithTimeline } from "../model/HallWithTimeline";
import { SessionForTimeline } from "../../session/model/SessionForTimeline";
import { SessionForTimelineAdmin } from "../../session/ui/SessionForTimelineAdmin";

export const HallWithTimelineAdmin = (props: {hall: HallWithTimeline}) => {
    const {hall} = props;

    return (

        <div className="conf-step__seances-hall">
            <h3 className="conf-step__seances-title">{hall.name}</h3>
            <div className="conf-step__seances-timeline">
                {hall.sessions.map((session: SessionForTimeline) => {
                    return (
                        <SessionForTimelineAdmin session={session} key={session.id}/>
                    )
                })}            
            </div>
        </div>
    )
}
