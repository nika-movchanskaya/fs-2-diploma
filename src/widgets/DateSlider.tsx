import React, { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import weekday from "dayjs/plugin/weekday";
import updateLocale from "dayjs/plugin/updateLocale";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(weekday);
dayjs.extend(updateLocale);
dayjs.extend(isToday);
dayjs.locale("ru");

const weekDays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

interface DateSliderProps {
  selectedDay: string,
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
}

const DateSlider: React.FC<DateSliderProps> = ({ selectedDay, setSelectedDay }) => {
  const today = dayjs();
  const [startDate, setStartDate] = useState(today);

  const days = Array.from({ length: 6 }, (_, i) => startDate.add(i, "day"));

  const nextDay = () => setStartDate(startDate.add(1, "day"));

  const prevDay = () => {
    if (!startDate.isSame(today, "day")) {
      setStartDate(startDate.subtract(1, "day"));
    }
  };

  return (
    <nav className="page-nav">
      <button className="page-nav__day page-nav__day_prev" onClick={prevDay} disabled={startDate.isSame(today, "day")}/>

      {days.map((day, index) => {
        const isToday = day.isToday();
        const isWeekend = day.day() === 0 || day.day() === 6;
        const isChosen = index === 2;

        return (
          <a
            key={day.format("YYYY-MM-DD")}
            className={`page-nav__day ${isToday ? "page-nav__day_today" : ""} 
                        ${isWeekend ? "page-nav__day_weekend" : ""} 
                        ${selectedDay === day.format("YYYY-MM-DD") ? "page-nav__day_chosen" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSelectedDay(day.format("YYYY-MM-DD"));
            }}
          >
            <span className="page-nav__day-week">{weekDays[day.day()]}</span>
            <span className="page-nav__day-number">{day.format("D")}</span>
          </a>
        );
      })}

      <button className="page-nav__day page-nav__day_next" onClick={nextDay}/>
    </nav>
  );
};

export default DateSlider;
