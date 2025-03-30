import { FilmWithHallTime } from "../entities/film/model/FilmWithHallTime";
import { FilmElem } from "../entities/film/ui/FilmElem";
import dayjs from 'dayjs';
import { createRequest } from "../shared/api/createRequest";
import { useEffect, useState } from "react";
import DateSlider from "../widgets/DateSlider";

export const IndexContent = (props: {
    backendServer: string
}) => {
    const {backendServer} = props;
    const [selectedDay, setSelectedDay] = useState<string>(dayjs().format("YYYY-MM-DD"));

    const getFilms = (callback: any, date: string) => {
        createRequest({
            url: backendServer + `/api/films?day=${date}`,
            sendMethod: 'GET',
            callback,
        });
    }

    const [films, setFilms] = useState<FilmWithHallTime[]>([]);

    //get all the films for the date
    useEffect(() => {
        const resp = getFilms((data: any) => {
            setFilms(data);
        }, selectedDay)

        setFilms(films);

        return () => {}
    }, [selectedDay]);

    return (
        <>
            <DateSlider selectedDay={selectedDay} setSelectedDay={setSelectedDay}/>
            <main>
                {films.map((item: FilmWithHallTime) => {
                    return (
                        <FilmElem key={item.id} backendServer={backendServer} film={item}/>
                    )
                })}
            </main>
        </>
    )
}
