import { useLocation, useNavigate } from "react-router-dom";

export const PaymentContent = () => {
    const location = useLocation();
    const { film_name, hall_name, date, start_time, seats, qr_url, sum } = location.state || {};
    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate('/ticket', {
            state: {
                film_name,
                hall_name,
                date,
                start_time,
                seats,
                qr_url
            }
        });
    }

    return (
        <main>
            <section className="ticket">
            
            <header className="tichet__check">
                <h2 className="ticket__check-title">Вы выбрали билеты:</h2>
            </header>
            
            <div className="ticket__info-wrapper">
                <p className="ticket__info">На фильм: <span className="ticket__details ticket__title">{film_name}</span></p>
                <p className="ticket__info">В зале: <span className="ticket__details ticket__hall">{hall_name}</span></p>
                <p className="ticket__info">Дата: <span className="ticket__details ticket__start">{date}</span></p>
                <p className="ticket__info">Начало сеанса: <span className="ticket__details ticket__start">{start_time}</span></p>
                <p className="ticket__info">Стоимость: <span className="ticket__details ticket__cost">{sum}</span> рублей</p>
                <p className="ticket__info">Места: <span className="ticket__details ticket__chairs">{seats.map((seat: any) => `ряд: ${seat.index_y}, место: ${seat.index_x}`)}</span></p>

                <button className="acceptin-button" onClick={handleOnClick}>Получить код бронирования</button>

                <p className="ticket__hint">После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.</p>
                <p className="ticket__hint">Приятного просмотра!</p>
            </div>
            </section>     
        </main>
    )
}
