import '../index.css';
import React, { useState, useEffect } from 'react';

import { BrowserRouter, useParams, Route, Routes, NavLink, useLocation } from 'react-router-dom';


const REST_API_URL = "http://localhost:8080/";

export async function getAllRooms(){
    try {
        const response = await fetch(REST_API_URL + "rooms/all");

        const result = await response.json();
        
        return await result;
    } catch (error) {
        console.error(error.message);
    }
}

export async function getAllTickets(parts){
    try {
        const response = await fetch(REST_API_URL + "tickets/all");

        const result = await response.json();

        const final_result = [];

        let d = 0;
        for(let i = 0; i < result.length; i++)
        {
            let time = await result[i].start_time.split('-');

            if(parts[0] === time[0])
            {
                if(parts[1] === time[1])
                {
                    if(parts[2] === time[2])
                    {
                        final_result[d] = await result[i];
                        d++;
                    }
                }
            }
        }
        
        return await final_result;
    } catch (error) {
        console.error(error.message);
    }
}

export function DayInfo() {
    const monthNamesRu = [
    "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
    "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
    ];

    const [rooms, setRooms] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [tableWidth, setTableWidth] = useState(0);
    const [error, setError] = useState(null);

    const { date } = useParams();               // date = "2024-02-25"
    const parts = date.split('-');              // ['2024', '02', '25']

    useEffect(() => {
        async function fetchData() {
            try {
                const rooms_data = await getAllRooms();
                const tickets_data = await getAllTickets(parts);

                setRooms(rooms_data);
                setTickets(tickets_data);
                
                setTableWidth(rooms_data.length);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchData();
    }, []);

    const pre_final_date = new Date(parts[0],parts[1] - 1,parts[2]);
    const monthNameRu = monthNamesRu[pre_final_date.getMonth()];

    const fullDateString = `${parts[2]} ${monthNameRu} ${parts[0]} года`;

    if (error) {
        return <p>Ошибка загрузки комнат: {error}</p>;
    }

    let columns = Array.from({ length: tableWidth });
    let rows = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00","06:00","07:00","08:00","09:00","10:00", "11:00","12:00",
                "13:00", "14:00", "15:00", "16:00", "17:00", "18:00","19:00","20:00","21:00","22:00","23:00","24:00"];

    let rows_date = Array.from({ length: tableWidth });

    // console.log(rooms);
    // console.log(tickets);

    // select row -> select column -> getting all tickets -> if ticket.id == column_id -> checking start_time
    for(let column_id = 0; column_id < rows_date.length; column_id++)
    {
        rows_date[column_id] = Array.from({ length: rows.length });

        for(let d = 0; d < rows_date[column_id].length; d++)
        {
            tickets.forEach(ticket => {
                if(ticket.room.id - 1 === column_id){
                    let ticket_start_time = ticket.start_time.split('-');
                    let ticket_end_time = ticket.end_time.split('-');

                    if(ticket_start_time !== undefined && ticket_end_time !== undefined)
                    {
                        let ticket_start_time_hour = parseInt(ticket_start_time[3].split(':'), 10);
                        let ticket_end_time_hour = parseInt(ticket_end_time[3].split(':'), 10);

                        if(ticket_start_time_hour <= d && ticket_end_time_hour >= d)
                        {
                            rows_date[column_id][d] = ticket;
                        }
                    }                    
                }
            })
        }
    }

    // console.log(rows_date);

    return (
        <div style={{ textAlign: "center", width: "100%", paddingTop: "50px" }}>
            <p className="font32"> {fullDateString} </p>

            <div style={{ display:"flex", justifyContent:"center", columnGap:"10px", marginTop:"25px" }}>
                <table className="time-table" style={{ margin: "0 0", borderCollapse: "collapse", width:"200px" }}>
                    <thead style={{ height: "59px"}}>
                        <tr>
                            <th>
                                <NavLink to="/add_ticket" className="font24" style={{ display: "block", width: "100%", height: "100%", padding: "10px 0", border: "1px solid black", borderRadius: "10px" }}>
                                    Создать тикет
                                </NavLink>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rows.map((item, d) => (
                                <tr key={d} className='font24' style={{ width:"200px", height: "50px" }}>
                                    <td>{item}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <table className="rooms-table" style={{ margin: "0 0", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {
                                columns.map((_, d) => (
                                    <th key={d} className='font24' style={{ width:"200px", padding:"15px" }}>
                                        { rooms[d] ? `${rooms[d].name}` : ""}
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rows.map((_, i) => (
                                <tr key={i} style={{ height: "50px" }}>
                                    { 
                                        columns.map((_, d) => (  
                                            rows_date[d][i] !== undefined ? (
                                                <td key={d} className='font24' style={{ width:"200px", padding:"0 15px",
                                                    borderLeft:"1px solid black", borderRight:"1px solid black", 
                                                    borderTop: rows_date[d][i - 1] !== rows_date[d][i] ? "1px solid black" : "0",
                                                    borderBottom: rows_date[d][i + 1] !== rows_date[d][i] ? "1px solid black" : "0" 
                                                }}>
                                                    {
                                                        rows_date[d][i - 1] !== rows_date[d][i] ? (      
                                                            <p>
                                                                { 
                                                                    rows_date[d][i].user !== null ? (
                                                                        rows_date[d][i].user.name
                                                                    ) : null
                                                                }
                                                            </p>
                                                        ) : null
                                                    }
                                                    {
                                                        rows_date[d][i] == rows_date[d][i - 2] && rows_date[d][i] !== rows_date[d][i - 3] ? (
                                                            <p>
                                                                { 
                                                                    rows_date[d][i].comment !== null ? (
                                                                        rows_date[d][i].comment
                                                                    ) : null
                                                                }
                                                            </p>
                                                        ) : null
                                                    }
                                                    {
                                                        rows_date[d][i + 1] == rows_date[d][i - 2] & rows_date[d][i + 1] !== rows_date[d][i - 1] ? (
                                                            <p>
                                                                { 
                                                                    rows_date[d][i].comment !== null ? (
                                                                        rows_date[d][i].comment
                                                                    ) : null
                                                                }
                                                            </p>
                                                        ) : null
                                                    }
                                                </td>
                                            ) : (
                                                <td key={d} className='font24' style={{ width:"200px", padding:"0 15px" }}>
                                                    <p></p>
                                                </td>
                                            )
                                        ))
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