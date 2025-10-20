import logo from './img/null_avatar.png';
import arrow from './img/arrow.png';
import './index.css';

import React, { useState, useRef, useEffect } from 'react';

import { BrowserRouter, Route, Routes, NavLink, useLocation } from 'react-router-dom';

import { MonthCalendar } from './components/main';
import { LoginUser } from './components/login';
import { DayInfo } from './components/dayInfo';
import { AddTicket } from './components/addticket';

import { useAuth } from './components/auth';

function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date());

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

function RouteChangeListener({ children }) {
  const location = useLocation();
  const bodyRef = useRef(null);

  const checkBodyHeight = () => {
    if (!bodyRef.current) return;

    window.requestAnimationFrame(() => {
      const bodyElement = bodyRef.current;
      const viewportHeight = window.innerHeight;
      const bodyHeight = bodyElement.offsetHeight;

      console.log(bodyHeight, viewportHeight);

      if (bodyHeight < viewportHeight) {
        bodyElement.style.minHeight = '100dvh';
      } else if (bodyHeight >= viewportHeight){}
    });
  };

  useEffect(() => {
    checkBodyHeight();

    window.addEventListener('resize', checkBodyHeight);

    return () => {
      window.removeEventListener('resize', checkBodyHeight);
    };
  }, [location]);

  return (
    <div id="products-list-container" className="body" ref={ bodyRef } style={{
      background: 'linear-gradient(90deg, white, lightblue)',
      width: '100%',
      height: '100%'
    }}>
      {children}
    </div>
  );
}


function App() {
  const { username } = useAuth();
  // console.log(username);

  return (
    <BrowserRouter>
      <RouteChangeListener>
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
          <Route path="/add_ticket" element={<AddTicket />} />
        </Routes>
      </RouteChangeListener>
    </BrowserRouter>
  );
}

export default App;