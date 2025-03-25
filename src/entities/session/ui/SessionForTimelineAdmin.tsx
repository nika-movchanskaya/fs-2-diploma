import { SessionForTimeline } from "../model/SessionForTimeline";

export const SessionForTimelineAdmin = (props: {session: SessionForTimeline}) => {
    const {session} = props;

    const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };
    
    function getBackgroundColorById(id: number) {
    
        const filmElem = document.querySelector(`.conf-step__movie[data-id="${id}"]`) as HTMLElement;
        
        return filmElem ? getComputedStyle(filmElem).backgroundColor : 'rgb(133, 255, 137)';
    }

    const totalMinutes = 24 * 60;

    const startMinutes = timeToMinutes(session.start_time);
    const leftPercent = (startMinutes / totalMinutes) * 100;
    const widthPercent = (session.film.duration / totalMinutes) * 100;

    const backgroundColor = getBackgroundColorById(session.film.id);

    const movieStyle: React.CSSProperties = {
        position: "absolute",
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        backgroundColor: backgroundColor,
    };

    return (
        <div className="conf-step__seances-movie" style={movieStyle}>
            <p className="conf-step__seances-movie-title">{session.film.name}</p>
            <p className="conf-step__seances-movie-start">{session.start_time}</p>
        </div>
    )
}
