import '../index.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Вспомогательная функция для получения дней месяца
function getDaysInMonth(year, month) {
    const days = [];

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
        days.push(new Date(day));
    }
    return days;
}

export function MonthCalendar({ currentDate, onDateSelect }) {
    const navigate = useNavigate();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const daysInMonth = getDaysInMonth(year, month);

    const handleDayClick = (day) => {
        const dayDate = day.getDate();
        const monthIndex = day.getMonth();
        const yearDate = day.getFullYear();

        const newDate = new Date(yearDate, monthIndex, dayDate, 0, 0, 0, 0);

        const formattedMonth = (monthIndex + 1).toString().padStart(2, '0');
        const formattedDay = dayDate.toString().padStart(2, '0');
        const dateString = `${yearDate}-${formattedMonth}-${formattedDay}`;

        //console.log(dateString);

        navigate(`/day/${dateString}`);

        if (onDateSelect) {
            onDateSelect(newDate);
        }
    };

    const monthName = currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

    return (
        <div className="month-calendar">
            <h2>{ monthName }</h2>
            <div className="calendar-grid">
                {
                    daysInMonth.map((day) => {
                        const isCurrentDay = day.toDateString() === new Date().toDateString();
                        const dayOfMonth = day.getDate();

                        return (
                            <div
                                key={day.toISOString()}
                                className={`calendar-day ${isCurrentDay ? 'today' : ''}`}
                                onClick={() => handleDayClick(day)}
                            >
                                {dayOfMonth}
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}