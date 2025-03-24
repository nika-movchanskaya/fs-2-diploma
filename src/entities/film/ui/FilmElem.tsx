import { FilmWithHallTime } from "../model/FilmWithHallTime"
import { HallTime } from "../../hall/model/HallTime";
import { NavLink } from "react-router-dom";
import { getMinutesText } from "../../../features/formats";
import { SessionShort } from "../../session/model/SessionShort";

export const FilmElem = (props: {film: FilmWithHallTime}) => {
    const {film} = props;

    return (
        <section className="movie">
            <div className="movie__info">      
                <div className="movie__poster">
                    <img src={film.image}
                        className="card-img-top img-fluid" alt={film.name}/>
                </div>
                <div className="movie__description">        
                    <h2 className="movie__title">{film.name}</h2>
                    <p className="movie__synopsis">{film.description}</p>
                    <p className="movie__data">
                        <span className="movie__data-duration">{getMinutesText(film.duration)}</span>
                        <span className="movie__data-origin">{film.origin}</span>
                    </p>
                </div>    
            </div>  
            {film.hallTimes?.map((hall: HallTime) => {
                return (
                    <div key={hall.hall_id} className="movie-seances__hall">
                        <h3 className="movie-seances__hall-title">{hall.name}</h3>
                        <ul className="movie-seances__list">
                            {hall.sessions.map((session: SessionShort) => {
                                return (
                                    <li key={session.session_id} className="movie-seances__time-block"><a className="movie-seances__time" href={`/session/${session.session_id}`}>{session.start_time}</a></li>
                                )
                            })}
                        </ul>
                    </div>
                )
            })}
        </section>
    )
}