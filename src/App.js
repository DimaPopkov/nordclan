import logo from './img/null_avatar.png';
import arrow from './img/arrow.png';
import './index.css';

import React, { useState, useEffect } from 'react';

import { BrowserRouter, Route, Routes, Link, useParams, NavLink } from 'react-router-dom';

import { MonthCalendar } from './components/main';
import { LoginUser } from './components/login';
import { DayInfo } from './components/dayInfo';

import { useAuth } from './components/auth';


function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date()); // Состояние для текущей даты

  // Можно добавить кнопки для смены месяца, если нужно
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="home-page">
      <div className="month-navigation">       
        <img className="navigation-btn" onClick={goToPreviousMonth} src={arrow} style={{ height:"50px" }} />
        <MonthCalendar currentDate={currentDate} />
        <img className="navigation-btn" onClick={goToNextMonth} src={arrow} style={{ rotate:"180deg", height:"50px" }}/>        
      </div>
    </div>
  );
}

function App() {
  const { username } = useAuth();
  console.log(username);

  return (
    <BrowserRouter>
      <div id="products-list-container" className="body">
        <header>
          <NavLink to="/" className="btn_logo font24" style={{ paddingLeft:'50px' }}> MeetRoom </NavLink>
          <NavLink to="/login" style={{ display: 'flex', columnGap:"10px", cursor:"pointer", textDecoration:"none" }}>
            <p className='font18' style={{ alignContent:"center" }}> { username } </p>
            <img src={logo} className='logo'/>
          </NavLink>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="/day/:date" element={<DayInfo />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;