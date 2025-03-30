import { FilmAdmin } from "../../film/model/FilmAdmin";

export const FilmElemAdmin = (props: {backendServer: string, film: FilmAdmin}) => {
    const {backendServer, film} = props;

    return (
        <div className="conf-step__movie" key={film.id} data-id={film.id}>
            <img className="conf-step__movie-poster" alt="poster" src={`${backendServer}/storage/${film.image}`}/>
            <h3 className="conf-step__movie-title">{film.name}</h3>
            <p className="conf-step__movie-duration">{film.duration}</p>
        </div>
    )
}
