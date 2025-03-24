import { useLocation } from "react-router-dom";

export const TicketContent = () => {
    const location = useLocation();
    const { film_name, hall_name, date, start_time, seats, qr_url } = location.state || {};

    return (
        <main>
            <section className="ticket">
            
            <header className="tichet__check">
                <h2 className="ticket__check-title">Электронный билет</h2>
            </header>
            
            <div className="ticket__info-wrapper">
                <p className="ticket__info">На фильм: <span className="ticket__details ticket__title">{film_name}</span></p>
                <p className="ticket__info">В зале: <span className="ticket__details ticket__hall">{hall_name}</span></p>
                <p className="ticket__info">Дата: <span className="ticket__details ticket__start">{date}</span></p>
                <p className="ticket__info">Начало сеанса: <span className="ticket__details ticket__start">{start_time}</span></p>
                <p className="ticket__info">Места: <span className="ticket__details ticket__chairs">{seats.map((seat: any) => `ряд: ${seat.index_y}, место: ${seat.index_x}`)}</span></p>

                <img className="ticket__info-qr" src={qr_url}/>

                <p className="ticket__hint">Покажите QR-код нашему контроллеру для подтверждения бронирования.</p>
                <p className="ticket__hint">Приятного просмотра!</p>
            </div>
            </section>     
        </main>
    )
}
