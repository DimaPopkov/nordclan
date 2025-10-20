import '../index.css';
import React, { useState, useEffect, useRef } from 'react';

import { getAllRooms } from './dayInfo';
import { getAllTickets } from './dayInfo';

import { useAuth } from './auth';

export function AddTicket(){
    const { username } = useAuth();

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

    const [isOpen, setIsOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState("Не выбрано");
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const selectRoom = (room_id) => {
        setSelectedRoom(room_id);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target) &&
            buttonRef.current && !buttonRef.current.contains(event.target)) {
            setIsOpen(false);
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef, buttonRef]);

    console.log(rooms);

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
                           
                            <button 
                                className={`burger-button ${isOpen ? 'open' : ''}`}
                                onClick={toggleMenu}
                                aria-label="Открыть меню выбора комнаты"
                                ref={buttonRef}
                                >
                                <span className="burger-line"></span>
                                <span className="burger-line"></span>
                                <span className="burger-line"></span>
                            </button>

                            <p className="font24" style={{ paddingTop: "2px", margin: "0", flexGrow: "1", textAlign: "right" }}>
                                { selectedRoom }
                            </p>
                        </h3>  

                        <div className={`room-menu ${isOpen ? 'open' : ''}`} ref={menuRef}>
                            <ul className="room-list">
                                {
                                    rooms.map((room, id) => (
                                        <li key={id} className="room-item" onClick={() => selectRoom(room)}>
                                            { room.name }
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    
                    
                </div>
            ) : (
                <div style={{ textAlign:"center", padding:"50px 50px" }}>
                    <h2 className="font32"> Пожалуйста, войдите в аккаунт! </h2>
                </div>
            )
        }
        </div>
    );
}