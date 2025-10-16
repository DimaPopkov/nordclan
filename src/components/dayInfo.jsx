import '../index.css';
import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';


const REST_API_URL = "http://localhost:8080/";

async function getAllRooms(){
    try {
        const response = await fetch(REST_API_URL + "rooms/all");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        return await result;
    } catch (error) {
        console.error(error.message);
    }
}

export function DayInfo() {
    /* ────── 1. Массив месяцев ────── */
    const monthNamesRu = [
    "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
    "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
    ];

    /* ────── 2. Состояния для данных из API ────── */
    const [rooms, setRooms] = useState([]);
    const [tableWidth, setTableWidth] = useState(0);
    const [error, setError] = useState(null);

    /* ────── 3. Загрузка комнат при монтировании ────── */
    useEffect(() => {
    async function fetchRooms() {
    try {
        const data = await getAllRooms();
        setRooms(data);              // массив комнат
        setTableWidth(data.length);   // ширина таблицы
    } catch (err) {
        setError(err.message);
    }
    }

    fetchRooms();
    }, []);  // один раз при монтировании

    /* ────── 4. Данные из URL (абсолютно как вы делали) ────── */
    const { date } = useParams();               // date = "2024-02-25" пример
    const parts = date.split('-');              // ['2024', '02', '25']
    const pre_final_date = new Date(parts[0],parts[1] - 1,parts[2]);
    const monthNameRu = monthNamesRu[pre_final_date.getMonth()];

    const fullDateString = `${parts[2]} ${monthNameRu} ${parts[0]} года`;

    /* ────── 5. Что делать, если есть ошибка загрузки ────── */
    if (error) {
    return <p>Ошибка загрузки комнат: {error}</p>;
    }

    /* ────── 6. Рендер таблицы (или любого другого «табличного» layout) ────── */
    let columns = Array.from({ length: tableWidth });
    let rows = Array.from({ length: 12 + 1 });

    return (
        <div style={{ textAlign: "center", width: "100%", paddingTop: "50px" }}>
            <p className="font32"> {fullDateString} </p>

            <div style={{ display:"flex", justifyContent:"center" }}>
                <table className="time-table" style={{ margin: "0 0", borderCollapse: "collapse", width:"240px" }}>
                    <tr style={{ height: "69px"}}></tr>
                    {
                        rows.map((_, d) => (
                            <p key={d} className='font24' style={{ width:"200px", padding:"15px" }}>
                                {d}
                            </p>
                        ))
                    }
                </table>

                <table className="rooms-table" style={{ margin: "0 0", borderCollapse: "collapse" }}>
                    <tbody>
                        {
                            rows.map((_, i) => (
                                <tr key={i}>
                                    { i == 0 ? (
                                            columns.map((_, d) => (
                                                <td key={d} className='font24' style={{ width:"200px", padding:"15px" }}>
                                                    { rooms[d] ? `${rooms[d].name}` : ""}
                                                </td>
                                            ))
                                        ) : (
                                            <td className='font24' style={{ width:"200px", padding:"15px" }}></td>
                                        )
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}