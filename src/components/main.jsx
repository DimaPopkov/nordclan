import '../index.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Вспомогательная функция для получения дней месяца
function getDaysInMonth(year, month) {
    const days = [];

    const startDate = new Date(year, month - 1, 1); // Месяцы начинаются с 0
    const endDate = new Date(year, month, 0); // Последний день предыдущего месяца (month=0) даст последний день нужного месяца

    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
        days.push(new Date(day)); // Клонируем дату, чтобы избежать мутаций
    }
    return days;
}

export function MonthCalendar({ currentDate, onDateSelect }) {
    const navigate = useNavigate(); // Получаем функцию навигации

    // Определяем год и месяц для календаря
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Месяцы в JS начинаются с 0

    // Получаем список дней текущего месяца
    const daysInMonth = getDaysInMonth(year, month);

    // Обработчик клика по дню
    const handleDayClick = (day) => {
        const dayDate = day.getDate(); // День месяца (1-31)
        const monthIndex = day.getMonth(); // Индекс месяца (0-11)
        const yearDate = day.getFullYear(); // Год

        // 2. Создаем новую дату, явно установив время в полночь (00:00:00)
        // Это предотвратит проблемы с часовыми поясами при парсинге строки
        const newDate = new Date(yearDate, monthIndex, dayDate, 0, 0, 0, 0);

        // 3. Форматируем дату в строку YYYY-MM-DD
        // Обратите внимание: monthIndex + 1, так как getMonth() возвращает 0-11
        const formattedMonth = (monthIndex + 1).toString().padStart(2, '0');
        const formattedDay = dayDate.toString().padStart(2, '0');
        const dateString = `${yearDate}-${formattedMonth}-${formattedDay}`;

        // Форматируем дату в строку YYYY-MM-DD для URL
        //const dateString = day.toISOString().split('T')[0];
        console.log(dateString);

        navigate(`/day/${dateString}`);

        // Если вы хотите передать дату и в родительский компонент (необязательно для перенаправления)
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
                        // Проверяем, является ли этот день выбранным (текущим)
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