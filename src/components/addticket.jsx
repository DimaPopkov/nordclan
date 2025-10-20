import '../index.css';
import 'react-datepicker/dist/react-datepicker.css';

import DatePicker from 'react-datepicker';
import React, { useState, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import { getAllRooms } from './dayInfo';
import { getAllTickets } from './dayInfo';


import { useAuth } from './auth';

const REST_API_URL = "http://localhost:8080/";

function addZeroBeforeNumber(number){
    let start_number = number;
    let final_number;
    if (start_number < 10){
        final_number = '0' + start_number;
    } else
        final_number = start_number;

    return final_number;
}

function sliceAndBuildDate(selectedDateTime){
    const year = selectedDateTime.getFullYear();
    const month = selectedDateTime.getMonth();
    const day = selectedDateTime.getDate();
    const hour = selectedDateTime.getHours();
    const minutes = selectedDateTime.getMinutes();

    // console.log("Было: year:", year, "month:", month, "day:", day, "hour:", hour, "minutes:", minutes);

    const final_month = addZeroBeforeNumber(month + 1);
    const final_day = addZeroBeforeNumber(day);
    const final_hour = addZeroBeforeNumber(hour);
    const final_minutes = addZeroBeforeNumber(minutes);

    // console.log("Стало: year:", year, "month:", final_month, "day:", final_day, "hour:", final_hour, "minutes:", final_minutes);

    const final_time = year + "-" + final_month + "-" + final_day + "-" + final_hour + ":" + final_minutes;

    // console.log(final_time);
    return final_time;
}

export function AddTicket(){
    const { username, id } = useAuth();
    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
            async function fetchData() {
                try {
                    const rooms_data = await getAllRooms();
    
                    setRooms(rooms_data);
                } catch (err) {
                    setError(err.message);
                }
            }
            fetchData();
        }, []);

    const [selectedRoomId, setSelectedRoomId] = useState("Не выбрано");

    const selectRoom = (room) => {
        setSelectedRoomId(room);
    };

    const [selectedDateTimeStart, setSelectedDateTimeStart] = useState(new Date());
    const [selectedDateTimeEnd, setSelectedDateTimeEnd] = useState(new Date());

    const handleDateChangeStart = (date) => {
        setSelectedDateTimeStart(date);
    };
    
    const handleDateChangeEnd = (date) => {
        setSelectedDateTimeEnd(date);
    };

    const createTicket = () => {
        const textarea_text = document.getElementById("textarea").value;

        const start_time = sliceAndBuildDate(selectedDateTimeStart);
        const end_time = sliceAndBuildDate(selectedDateTimeEnd);

        const url = REST_API_URL + "tickets/add/?st_time=" + start_time + "&end_time=" + end_time + "&comment=" + textarea_text + "&room=" + selectedRoomId + "&user=" + id;
        // console.log(start_time, end_time);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "success"
        })
        .then(responce => {
            if (!responce.ok) {
                return responce.text().then(text => {
                    throw new Error(`HTTP error! status: ${responce.status}, message: ${text}`);
                });
            }
            return responce.json();
        })

        /* Нужно что-то вывести пользователю на экран */
        navigate("/");
    }

    return(
        <div className="addTicket_container"> 
        {        
            username != null ? (
                <div style={{ display:"flex", flexDirection:"column" }}>
                    <div className='font24' style={{ width:"100%", marginTop:"0.5em" }}>
                        <h3 style={{ display:"flex", alignItems:"center", columnGap:"10px" }}>
                            Пользователь: 
                            <p className='font24' style={{ paddingTop:"2px" }}> { username } </p>
                        </h3>  
                    </div>
                    <div className='font24' style={{ width:"100%" }}>
                        <h3 style={{ display:"flex", alignItems:"center", columnGap:"10px" }}>
                            Выберите комнату:             
                            <p className="font24" style={{ paddingTop: "2px", margin: "0", flexGrow: "1", textAlign: "right" }}>
                                { rooms[selectedRoomId - 1] !== undefined ? (rooms[selectedRoomId - 1].name) : '' }
                            </p>
                        </h3>  

                        <div className="room-menu">
                            <ul className="room-list">
                                {
                                    rooms.map((room, id) => (
                                        <li key={id} className="room-item" onClick={() => selectRoom(room.id)}>
                                            { room.name }
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className='font24' style={{ width:"100%", marginTop:"1em" }}>
                        <h3 style={{ display:"flex", flexDirection:"column", alignItems:"start", columnGap:"10px" }}>
                            Выберите дату и время:             
                            <div style={{ display:"flex", flexDirection:"column" }}>
                                <div style={{ marginTop: '10px' }}>
                                    <div style={{ paddingLeft:"20px", paddingTop:"10px" }}>
                                        <p className="font18">Дата начала бронирования:</p>
                                            <DatePicker
                                                selected={ selectedDateTimeStart }
                                                onChange={ handleDateChangeStart }
                                                showTimeSelect // Показывает выбор времени
                                                dateFormat="Pp" // Формат даты и времени (например, 11/25/2023, 11:00 AM)
                                                timeFormat="HH:mm" // Формат времени (24-часовой)
                                                timeIntervals={15} // Интервалы времени (например, 15 минут)
                                                placeholderText="Выберите дату и время"
                                                isClearable // Добавляет кнопку очистки
                                                className='font18'
                                            />
                                        <br/>
                                        <p className="font18">Дата окончания бронирования:</p>
                                            <DatePicker
                                                selected={ selectedDateTimeEnd }
                                                onChange={ handleDateChangeEnd }
                                                showTimeSelect // Показывает выбор времени
                                                dateFormat="Pp" // Формат даты и времени (например, 11/25/2023, 11:00 AM)
                                                timeFormat="HH:mm" // Формат времени (24-часовой)
                                                timeIntervals={15} // Интервалы времени (например, 15 минут)
                                                placeholderText="Выберите дату и время"
                                                isClearable // Добавляет кнопку очистки
                                                className='font18'
                                            />
                                    </div>
                                    <div style={{  marginTop:"25px", display:"flex", flexDirection:"column" }}>
                                        <h4> Дополнительный комментарий </h4>
                                        <textarea style={{ width:"300px", height:"200px", maxWidth:"790px", minWidth:"400px" }} id="textarea"></textarea>
                                    </div>
                                </div>
                            </div>
                        </h3>  
                    </div>                            
                    <button onClick={ createTicket } style={{ marginTop: '20px' }} className='font18'>
                        Забронировать переговорку
                    </button>
                </div>
            ) : (
                <div style={{ textAlign:"center", padding:"50px 50px" }}>
                    <h1 className="font32"> Пожалуйста, войдите в аккаунт! </h1>
                </div>
            )
        }
        </div>
    );
}