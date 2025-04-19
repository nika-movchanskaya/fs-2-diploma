import { useNavigate } from "react-router-dom";
import { createRequest } from "../../shared/api/createRequest";
import { useEffect, useState } from "react";
import { Hall } from "../../entities/hall/model/Hall";
import { HallElem } from "../../entities/hall/ui/HallAdmin";
import { HallRadioButton } from "../../entities/hall/ui/HallRadioButton";
import HallSchema from "../../entities/hallSchema/ui/HallSchema";
import { SeatSchema } from "../../entities/seat/model/SeatSchema";
import { FilmElemAdmin } from "../../entities/film/ui/FilmElemAdmin";
import { FilmAdmin } from "../../entities/film/model/FilmAdmin";
import { HallWithTimeline } from "../../entities/hall/model/HallWithTimeline";
import { HallWithTimelineAdmin } from "../../entities/hall/ui/HallWithTimeLineAdmin";
import dayjs from "dayjs";
import DateSlider from "../../widgets/DateSlider";

export const MainContent = (props: any) => {
    const navigate = useNavigate();
    const {backendServer} = props;

    const getHalls = (callback: any) => {
        createRequest({
            url: backendServer + `/api/halls`,
            sendMethod: 'GET',
            callback,
        });
    }

    const [halls, setHalls] = useState<Hall[]>([]);

    //creating hall popup
    const [isOpen, setIsOpen] = useState(false);
    const [hallName, setHallName] = useState("");

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    //create hall
    const handleCreateHall = (name: string) => {
        if (hallName.trim() === "") return alert("Введите название зала!");

        const resp = createRequest({
            url: backendServer + '/api/hall/',
            sendMethod: 'POST', 
            data: {'name': name},
            callback: (data: any) => {
                console.log("New hall created:", hallName);
                setHallName("");
                closeModal();
            }
        });
    };

    //delete hall
    const handleDeleteHall = (id: number) => {
        const resp = createRequest({
            url: backendServer + '/api/hall/',
            sendMethod: 'DELETE', 
            callback: (data: any) => {
                console.log("Hall deleted:", hallName);
            }
        });
    }

    //upadte hall prices
    const [regularPrice, setRegularPrice] = useState<number|string>(0);
    const [initRegularPrice, setInitRegularPrice] = useState<number>(0);
    const [vipPrice, setVipPrice] = useState<number|string>(0);
    const [initVipPrice, setInitVipPrice] = useState<number>(0);

    //update data for selected hall
    const [currentHall, setCurrentHall] = useState<Hall>();
    const [hallId, setHallId] = useState<number>();

    useEffect(() => {
        if (currentHall) {
            setHallId(currentHall.id);
            setHallX(currentHall.x);
            setHallY(currentHall.y);

            //getting hall prices and save them
            const resp = createRequest({
                url: backendServer + '/api/price/' + currentHall.id, 
                sendMethod: 'GET', 
                callback: (data: any) => {
                    setRegularPrice(data.price?.regular ? data.price.regular : 0);
                    setInitRegularPrice(data.price?.regular);
                    setVipPrice(data.price?.vip ? data.price.vip : 0);
                    setInitVipPrice(data.price?.vip);
                }
            });
        }
    }, [currentHall]);

    //update prices
    const handleUpdatePrices = (regularPrice?: number|string, vipPrice?: number|string) => {
        if (!regularPrice || (regularPrice && Number(regularPrice) < 0) || !vipPrice || (vipPrice && Number(vipPrice) < 0)) return alert("Введите значение цены > 0");

        const resp = createRequest({
            url: backendServer + `/api/price/${hallId}`,
            sendMethod: 'GET',
            callback: (data: any) => {
                if (data.price) {
                    const requestData: Record<string, number> = {};

                    if (regularPrice !== 0) requestData.regular = Number(regularPrice);
                    if (vipPrice !== 0) requestData.vip = Number(vipPrice);

                    const resp = createRequest({
                        url: backendServer + `/api/price/${hallId}`,
                        sendMethod: 'PATCH',
                        data: requestData,
                        callback: (data: any) => {
                            console.log("Prices updated");
                        }
                    });
                }
                else if (regularPrice && vipPrice) {
                    const resp = createRequest({
                        url: backendServer + `/api/price`,
                        sendMethod: 'POST',
                        data: {
                            'hall_id': hallId,
                            'regular': Number(regularPrice),
                            'vip': Number(vipPrice)
                        },
                        callback: (data: any) => {
                            console.log("Prices created");
                        }
                    });
                }
            }
        });
    };

    const handleCancelPrices = () => {
        setRegularPrice(initRegularPrice || 0);
        setVipPrice(initVipPrice || 0);
    }

    //hall sizes
    const [hallX, setHallX] = useState<number|string>('');
    const [hallY, setHallY] = useState<number|string>('');
    const [seats, setSeats] = useState<SeatSchema[]>([]);

    //upadte hall sizes
    const handleUpdateSchema = (x: number|string, y: number|string, seats: SeatSchema[]) => {
        if (Number(x) < 1 || Number(y) < 1 || !x || !y) return alert("Введите значение размеров > 0");

        const resp = createRequest({
            url: backendServer + `/api/hall/${hallId}`,
            sendMethod: 'PATCH', 
            data: {
                'x': Number(x),
                'y': Number(y),
                'seats': seats
            },
            callback: (data: any) => {
                console.log("Schema updated");
            }
        });
    };

    const handleCancelSeats = () => {
        setHallX(currentHall?.x || 0);
        setHallY(currentHall?.y || 0);
    }

    //hall schema
    //when hallX, hallY changed -> update schema
    const generateSeats = (x: number|string, y: number|string) => {
        let newSeats: SeatSchema[] = [];
        let idCounter = 1;

        if (hallId) {
            for (let i = 1; i <= Number(x); i++) {
                for (let j = 1; j <= Number(y); j++) {
                    newSeats.push({
                        id: idCounter++,
                        hall_id: hallId,
                        index_x: i,
                        index_y: j,
                        status: "regular"
                    });
                }
            }
        }

        return newSeats;
    };

    useEffect(() => {
        if (hallId) {
            createRequest({
                url: `${backendServer}/api/hall-schema/${hallId}`,
                sendMethod: 'GET',
                callback: (data: any) => {
                    console.log(data);
                    if (Array.isArray(data)) {
                        setSeats(data);
                    }
                },
            });
        }
    }, [hallId]);

    useEffect(() => {
        setSeats(generateSeats(hallX, hallY));
    }, [hallX, hallY, hallId]);

    const handleSeatStatusChange = (seatId: number, newStatus: "regular" | "vip" | "disabled") => {
        setSeats(prevSeats =>
            prevSeats.map(seat => (seat.id === seatId ? { ...seat, status: newStatus } : seat))
        );
    };

    //get all the halls
    useEffect(() => {
        const resp = getHalls((data: any) => {
            setHalls(data);
            setCurrentHall(data[0]);
        });

        return () => {}
    }, [hallName]);

    //get all the films
    useEffect(() => {
        const resp = getFilms((data: any) => {
            setFilms(data);
        });

        return () => {}
    }, []);

    //film creating popup
    const [isFilmOpen, setIsFilmOpen] = useState(false);
    const [filmName, setFilmName] = useState("");
    const [filmDescription, setFilmDescription] = useState("");
    const [filmOrigin, setFilmOrigin] = useState("");
    const [filmDuration, setFilmDuration] = useState<number|string>(0);
    const [filmImage, setFilmImage] = useState<File | null>(null);

    const openFilmModal = () => setIsFilmOpen(true);
    const closeFilmModal = () => setIsFilmOpen(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFilmImage(e.target.files[0]);
        }
    };

    //create film
    const handleCreateFilm = (name: string, description: string, origin: string, duration: string|number, image: File|null) => {
        if (filmName.trim() === "" || filmDescription.trim() === "" || filmOrigin.trim() === "") return alert("Введите название, описание, длительность, страну фильма!");
        else if (!filmDuration || (filmDuration && Number(filmDuration) <= 0)) {
            return alert("Введите корректную продолжительность фильма!");
        }
        else if (!filmImage) {
            alert("Выберите изображение");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("origin", origin);
        formData.append("duration", duration.toString());
        formData.append("image", filmImage);

        const resp = createRequest({
            url: backendServer + '/api/admin/film/',
            sendMethod: 'POST', 
            data: formData,
            isFormData: true,
            callback: (data: any) => {
                console.log("New film created:", filmName);
                setFilmName("");
                setFilmDescription("");
                setFilmOrigin("");
                setFilmDuration(0);
                setFilmImage(null);

                closeFilmModal();
            }
        });
    };

    //get films
    const [films, setFilms] = useState<FilmAdmin[]>([]);

    const getFilms = (callback: any) => {
        createRequest({
            url: backendServer + `/api/admin/films`,
            sendMethod: 'GET',
            callback,
        });
    }

    //get timelines
    const [selectedDay, setSelectedDay] = useState<string>(dayjs().format("YYYY-MM-DD"));
    
    const getHallsWithTimeline = (callback: any, date: string) => {
        createRequest({
            url: backendServer + `/api/admin/sessions?date=${date}`,
            sendMethod: 'GET',
            callback,
        });
    }

    const [hallsWithTimeline, setHallsWithTimeline] = useState<HallWithTimeline[]>([]);

    useEffect(() => {
        const resp = getHallsWithTimeline((data: any) => {
            setHallsWithTimeline(data);
        }, selectedDay)

        return () => {}
    }, [selectedDay]);

    //session creating popup
    const [isSessionOpen, setIsSessionOpen] = useState(false);
    const [filmSessionId, setFilmSessionId] = useState<number|null>(null);
    const [hallSessionId, setHallSessionId] = useState<number|null>(null);
    const [dateSession, setDateSession] = useState("");
    const [startTimeSession, setStartTimeSession] = useState("");
    const [availableSlots, setAvailableSlots] = useState<string[]>();

    const openSessionModal = () => setIsSessionOpen(true);
    const closeSessionModal = () => setIsSessionOpen(false);

    //create session
    const handleCreateSession = (film_id: number|null, hall_id: number|null, date: string, start_time: string) => {
        if (!film_id || !hall_id || date.trim() === "" || start_time === "") return alert("Заполните все поля!");

        const resp = createRequest({
            url: backendServer + '/api/admin/session/',
            sendMethod: 'POST', 
            data: {
                'film_id': film_id,
                'hall_id': hall_id,
                'date': date,
                'start_time': start_time,
            },
            callback: (data: any) => {
                console.log("New session created");
                setFilmSessionId(null);
                setHallSessionId(null);
                setDateSession("");
                setStartTimeSession("");

                closeSessionModal();
            }
        });
    };

    useEffect(() => {
        if (filmSessionId && hallSessionId && dateSession) {
            const resp = createRequest({
                url: backendServer + `/api/admin/available-start-times?film_id=${filmSessionId}&hall_id=${hallSessionId}&date=${dateSession}`,
                sendMethod: 'GET',
                callback: (data: any) => {
                    console.log("New session created");
                    setAvailableSlots(data.available_times);
                }
            });
        }
    }, [filmSessionId, hallSessionId, dateSession]);

    //activate/or deactivate all sessions
    const [isSessionsActive, setIsSessionsActive] = useState(false);

    const toggleSessions = () => {
        createRequest({
            url: `${backendServer}/api/admin/sessions/toggle-sale`,
            sendMethod: "PATCH",
            data: { active: !isSessionsActive },
            callback: (data) => {
                console.log("Sessions' status changed", data);
                setIsSessionsActive(!isSessionsActive);
            },
        });
    };
    
    return (
        <>
            <main className="conf-steps">
                <section className="conf-step">
                <header className="conf-step__header conf-step__header_opened">
                    <h2 className="conf-step__title">Управление залами</h2>
                </header>
                <div className="conf-step__wrapper">
                    <p className="conf-step__paragraph">Доступные залы:</p>
                    <ul className="conf-step__list">
                        {halls.map((hall: Hall) => {
                            return (
                                <HallElem hall={hall} key={hall.id} handleDelete={handleDeleteHall}/>
                            )
                        })}
                    </ul>
                    <button className="conf-step__button conf-step__button-accent" onClick={openModal}>Создать зал</button>

                    {isOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <p className="conf-step__paragraph">Введите название зала</p>
                                <p className="conf-step__paragraph">
                                <input
                                    type="text"
                                    value={hallName}
                                    onChange={(e) => setHallName(e.target.value)}
                                    placeholder="Название"
                                    className="conf-step__input width-100"
                                />
                                </p>
                                <button className="conf-step__button conf-step__button-regular" onClick={closeModal}>Отмена</button>
                                <button className="conf-step__button conf-step__button-accent" onClick={() => handleCreateHall(hallName)}>OK</button>
                            </div>
                        </div>
                    )}
                </div>
                </section>
                
                <section className="conf-step">
                <header className="conf-step__header conf-step__header_opened">
                    <h2 className="conf-step__title">Конфигурация залов</h2>
                </header>
                <div className="conf-step__wrapper">
                    <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
                    <ul className="conf-step__selectors-box">
                        {halls.map((hall: Hall) => {
                            return (
                                <HallRadioButton 
                                    hall={hall} 
                                    key={hall.id}
                                    hallId={hallId}
                                    updateHall={(hall: Hall) => setCurrentHall(hall)}
                                    radioName="_1"
                                />
                            )
                        })}
                    </ul>
                    <p className="conf-step__paragraph">Укажите количество рядов и максимальное количество кресел в ряду:</p>
                    <div className="conf-step__legend">
                    <label className="conf-step__label">Рядов, шт
                        <input type="number"
                            value={hallY}
                            onChange={(e) => {
                                const val = e.target.value;
                                setHallY(val === "" ? "" : Number(val));
                              }}
                            className="conf-step__input"
                        />
                    </label>
                    <span className="multiplier">x</span>
                    <label className="conf-step__label">Мест, шт
                        <input type="number"
                            value={hallX}
                            onChange={(e) => {
                                const val = e.target.value;
                                setHallX(val === "" ? "" : Number(val));
                              }}
                            className="conf-step__input"
                        />
                    </label>
                    </div>
                    <p className="conf-step__paragraph">Теперь вы можете указать типы кресел на схеме зала:</p>
                    <div className="conf-step__legend">
                    <span className="conf-step__chair conf-step__chair_standart"></span> — обычные кресла
                    <span className="conf-step__chair conf-step__chair_vip"></span> — VIP кресла
                    <span className="conf-step__chair conf-step__chair_disabled"></span> — заблокированные (нет кресла)
                    <p className="conf-step__hint">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
                    </div>  
                    
                    <div className="conf-step__hall">
                    <div className="conf-step__hall-wrapper">
                        <HallSchema seats={seats} onSeatStatusChange={handleSeatStatusChange}/>
                    </div>  
                    </div>
                    
                    <fieldset className="conf-step__buttons text-center">
                        <button className="conf-step__button conf-step__button-regular" onClick={handleCancelSeats}>Отмена</button>
                        <input type="submit" value="Сохранить" className="conf-step__button conf-step__button-accent" onClick={() => handleUpdateSchema(hallX, hallY, seats)}/>
                    </fieldset>                 
                </div>
                </section>
                
                <section className="conf-step">
                <header className="conf-step__header conf-step__header_opened">
                    <h2 className="conf-step__title">Конфигурация цен</h2>
                </header>
                <div className="conf-step__wrapper">
                    <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
                    <ul className="conf-step__selectors-box">
                        {halls.map((hall: Hall) => {
                            return (
                                <HallRadioButton 
                                    hall={hall} 
                                    key={hall.id}
                                    hallId={hallId}
                                    updateHall={(hall: Hall) => setCurrentHall(hall)}
                                    radioName="_2"
                                />
                            )
                        })}
                    </ul>
                    
                    <p className="conf-step__paragraph">Установите цены для типов кресел:</p>
                    <div className="conf-step__legend">
                        <label className="conf-step__label">Цена, рублей
                            <input type="number"
                                value={regularPrice}
                                onChange={(e) => setRegularPrice(e.target.value === "" ? NaN : Number(e.target.value))}
                                className="conf-step__input"
                            />
                        </label>
                        за <span className="conf-step__chair conf-step__chair_standart"></span> обычные кресла
                    </div>  
                    <div className="conf-step__legend">
                        <label className="conf-step__label">Цена, рублей
                            <input type="number"
                                value={vipPrice}
                                onChange={(e) => setVipPrice(e.target.value === "" ? NaN : Number(e.target.value))}
                                placeholder="0"
                                className="conf-step__input"
                            />
                        </label>
                        за <span className="conf-step__chair conf-step__chair_vip"></span> VIP кресла
                    </div>  
                    
                    <fieldset className="conf-step__buttons text-center">
                    <button className="conf-step__button conf-step__button-regular" onClick={handleCancelPrices}>Отмена</button>
                    <input type="submit" value="Сохранить" className="conf-step__button conf-step__button-accent" onClick={() => handleUpdatePrices(regularPrice, vipPrice)}/>
                    </fieldset>  
                </div>
                </section>
                
                <section className="conf-step">
                <header className="conf-step__header conf-step__header_opened">
                    <h2 className="conf-step__title">Сетка сеансов</h2>
                </header>
                <div className="conf-step__wrapper">
                    <p className="conf-step__paragraph">
                        <button className="conf-step__button conf-step__button-accent" onClick={openFilmModal}>Добавить фильм</button>
                    </p>

                    {isFilmOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <p className="conf-step__paragraph">Введите название фильма</p>
                                <p>
                                    <input
                                        type="text"
                                        value={filmName}
                                        onChange={(e) => setFilmName(e.target.value)}
                                        placeholder="Название"
                                        className="conf-step__input width-100"
                                    />
                                </p>
                                <p className="conf-step__paragraph">Описание</p>
                                <p>
                                    <input
                                        type="text"
                                        value={filmDescription}
                                        onChange={(e) => setFilmDescription(e.target.value)}
                                        placeholder="Описание"
                                        className="conf-step__input width-100"
                                    />
                                </p>
                                <p className="conf-step__paragraph">Страна создания</p>
                                <p>
                                    <input
                                        type="text"
                                        value={filmOrigin}
                                        onChange={(e) => setFilmOrigin(e.target.value)}
                                        placeholder="Страна создания"
                                        className="conf-step__input width-100"
                                    />
                                </p>
                                <p className="conf-step__paragraph">Длительность, мин</p>
                                <p>
                                    <input
                                        type="number"
                                        value={filmDuration}
                                        onChange={(e) => setFilmDuration(e.target.value === "" ? "" : Number(e.target.value))}
                                        placeholder="Длительность, мин"
                                        className="conf-step__input width-100"
                                    />
                                </p>
                                <p className="conf-step__paragraph">Фото</p>
                                <p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        placeholder="Фото"
                                        className="conf-step__input width-100"
                                    />
                                </p>
                                <button className="conf-step__button conf-step__button-regular" onClick={closeFilmModal}>Отмена</button>
                                <button className="conf-step__button conf-step__button-accent" onClick={() => handleCreateFilm(filmName, filmDescription, filmOrigin, Number(filmDuration), filmImage)}>OK</button>
                            </div>
                        </div>
                    )}

                    <div className="conf-step__movies">
                        {films.map((film: FilmAdmin) => {
                            return (
                                <FilmElemAdmin film={film} backendServer={backendServer} key={film.id}/>
                            )
                        })} 
                    </div>
                    
                    <div className="conf-step__seances">
                        <DateSlider selectedDay={selectedDay} setSelectedDay={setSelectedDay}/>      
                        {hallsWithTimeline.map((hall: HallWithTimeline) => {
                            return (
                                <HallWithTimelineAdmin hall={hall} key={hall.hall_id}/>
                            )
                        })} 
                    </div>
                    
                    <fieldset className="conf-step__buttons text-center">
                        <input type="submit" value="Добавить сеанс" className="conf-step__button conf-step__button-accent" onClick={openSessionModal}/>
                    </fieldset>  

                    {isSessionOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <p className="conf-step__paragraph">Выберите фильм</p>
                                <p>
                                    <select
                                        value={filmSessionId ?? ""}
                                        onChange={(e) => setFilmSessionId(Number(e.target.value))}
                                        className="conf-step__input width-100"
                                    >
                                        <option value="">Выберите фильм</option>
                                        {films.map((film) => (
                                            <option key={film.id} value={film.id}>
                                                {film.name}
                                            </option>
                                        ))}
                                    </select>
                                </p>
                                <p className="conf-step__paragraph">Зал</p>
                                <p>
                                    <select
                                        value={hallSessionId ?? ""}
                                        onChange={(e) => setHallSessionId(Number(e.target.value))}
                                        className="conf-step__input width-100"
                                    >
                                        <option value="">Выберите зал</option>
                                        {halls.map((hall) => (
                                            <option key={hall.id} value={hall.id}>
                                                {hall.name}
                                            </option>
                                        ))}
                                    </select>
                                </p>
                                <p className="conf-step__paragraph">Дата</p>
                                <p>
                                    <input
                                        type="date"
                                        value={dateSession}
                                        onChange={(e) => setDateSession(e.target.value)}
                                        className="conf-step__input width-100"
                                    />
                                </p>
                                <p className="conf-step__paragraph">Время начала</p>
                                <p>
                                    <select
                                        value={startTimeSession ?? ""}
                                        onChange={(e) => setStartTimeSession(e.target.value)}
                                        className="conf-step__input width-100"
                                    >
                                        <option value="">Выберите доступное время</option>
                                        {availableSlots && availableSlots.map((slot) => (
                                            <option key={slot} value={slot}>
                                                {slot}
                                            </option>
                                        ))}
                                    </select>
                                </p>
                                <button className="conf-step__button conf-step__button-regular" onClick={closeSessionModal}>Отмена</button>
                                <button className="conf-step__button conf-step__button-accent" onClick={() => handleCreateSession(filmSessionId, hallSessionId, dateSession, startTimeSession)}>OK</button>
                            </div>
                        </div>
                    )}
                </div>
                </section>
                
                <section className="conf-step">
                <header className="conf-step__header conf-step__header_opened">
                    <h2 className="conf-step__title">Открыть продажи</h2>
                </header>
                <div className="conf-step__wrapper text-center">
                    <p className="conf-step__paragraph">Всё готово, теперь можно:</p>
                    <button className="conf-step__button conf-step__button-accent" onClick={toggleSessions}>
                        {isSessionsActive ? "Приостановить продажу билетов" : "Открыть продажу билетов"}
                    </button>
                </div>
                </section>    
            </main>
            <script src="js/accordeon.js"></script>
        </>
    )
}
