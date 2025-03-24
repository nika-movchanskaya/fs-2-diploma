import { Seat } from "../entities/seat/model/Seat";
import { SeatElem } from "../entities/seat/ui/SeatElem";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createRequest } from "../shared/api/createRequest";
import { SeatShort } from "../entities/seat/model/SeatShort";

export const SessionContent = (props: {
    backendServer: string
}) => {
    const {backendServer} = props;
    const params = useParams();
    const [rows, setRows] = useState<Seat[][]>([]);    
    const [session, setSession] = useState<any>();
    const navigate = useNavigate();

    useEffect(() => {
        if (params.id) {
            const resp = createRequest({
                url: backendServer + '/api/session/' + params.id, 
                sendMethod: 'GET', 
                callback: (data: any) => {
                    setSession(data);
                }
            })
        }
    }, [params.id]);

    useEffect(() => {
        const seatsByRow = session?.seats?.reduce((acc: Record<number, Seat[]>, seat: Seat) => {
            if (!acc[seat.index_y]) {
                acc[seat.index_y] = [];
            }
            acc[seat.index_y].push(seat);
            return acc;
        }, {});

        setRows(seatsByRow);
    }, [session]);

    const [selectedSeats, setSelectedSeats] = useState<SeatShort[]>([]);
    const [selectedSum, setSelectedSum] = useState<number>(0);

    const toggleSeat = (seat: any) => {
        setSelectedSeats((prev) => {
            const newSelected = [...prev];
            const existingSeatIndex = newSelected.findIndex((s) => s.id === seat.id);

            if (existingSeatIndex !== -1) {
                newSelected.splice(existingSeatIndex, 1);
                setSelectedSum(selectedSum - seat.is_vip ? session.price_vip : session.price_regular);
            } else {
                newSelected.push(seat);
                setSelectedSum(selectedSum + seat.is_vip ? session.price_vip : session.price_regular);
            }

            return newSelected;
        });
    };
    
    const createTicket = (data: any) => {
        const resp = createRequest({
            url: backendServer + '/api/create-ticket/',
            sendMethod: 'POST', 
            data: data,
            callback: (data: any) => {
                console.log("data after create ticket: " + data);

                navigate('/payment', {
                    state: {
                        film_name: session.film.name,
                        hall_name: session.hall.name,
                        date: session.date,
                        start_time: session.start_time,
                        seats: selectedSeats,
                        sum: selectedSum,
                        qr_url: data.qr_url
                    }
                });
            }
        })
    }

    const handleOnClick = () => {
        createTicket({
            film_session_id: session.id,
            film_name: session.film.name,
            hall_name: session.hall.name,
            date: session.date,
            start_time: session.start_time,
            seats: selectedSeats
        });
    }
 
    if (session) {
        return (
            <main>
                <section className="buying">
                <div className="buying__info">
                    <div className="buying__info-description">
                    <h2 className="buying__info-title">{session.film.name}</h2>
                    <p className="buying__info-start">Начало сеанса: {session.start_time}</p>
                    <p className="buying__info-hall">{session.hall.name}</p>          
                    </div>
                    <div className="buying__info-hint">
                    <p>Тапните дважды, чтобы увеличить</p>
                    </div>
                </div>
                <div className="buying-scheme">
                    <div className="buying-scheme__wrapper">
                        {rows &&
                            Object.entries(rows).map(([index_y, row]) => (
                                <div key={index_y} className="buying-scheme__row">
                                    {row.map((seat: Seat) => (
                                        <SeatElem
                                            key={seat.id}
                                            seat={seat}
                                            selected={Array.from(selectedSeats).some((s: { id: number }) => s.id === seat.id)}
                                            onClick={() => toggleSeat({id: seat.id, index_x: seat.index_x, index_y: seat.index_y})}
                                        />
                                    ))}
                                </div>
                            ))
                        }
                    </div>
                    <div className="buying-scheme__legend">
                        <div className="col">
                            <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_standart"></span> Свободно (<span className="buying-scheme__legend-value">{session.price_regular}</span>руб)</p>
                            <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_vip"></span> Свободно VIP (<span className="buying-scheme__legend-value">{session.price_vip}</span>руб)</p>            
                        </div>
                        <div className="col">
                            <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_taken"></span> Занято</p>
                            <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_selected"></span> Выбрано</p>                    
                        </div>
                    </div>
                </div>

                <button className="acceptin-button" onClick={handleOnClick}>
                    Забронировать
                </button>
                </section>     
            </main>    
        )
    }
    else {
        return (
            <></>
        )
    }
}
