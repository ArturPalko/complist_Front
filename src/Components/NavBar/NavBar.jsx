import React, { useState } from 'react';
import s from './NavBar.module.css';
import { NavLink } from 'react-router-dom';
import PagesNavBar from './PagesNavBar/PagesNavBar';
import { useParams, useLocation } from "react-router-dom";
import Filter from './Filter/Filter';

function NavBar() {
  const [showDropdown, setShowDropdown] = useState(true);
  const [showPagesNavigation, setshowPagesNavigation] = useState(true);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
    setshowPagesNavigation(prev => !prev);
  };


  return (
    <div>
      <div className="nav">
        <nav>
          <div className={s.item}>
            <button onClick={toggleDropdown}
            className={s.dropdownBtn}>
              Довідники {showDropdown ? "▲" : "▼"}
            </button>
            {showDropdown && (
              <div className={s.dropdownContent}>
                <NavLink
                  to="/mails/Gov-ua/"
                  className={({ isActive }) => (isActive ? s.activeLink : undefined)}
                >
                  GOV-UA скриньки
                </NavLink>
                <NavLink
                  to="/mails/Lotus/"
                  className={({ isActive }) => (isActive ? s.activeLink : undefined)}
                >
                  Lotus скриньки
                </NavLink>
                <NavLink
                  to="/phones/"
                  className={({ isActive }) => (isActive ? s.activeLink : undefined)}
                  
                >
                  Телефони
                </NavLink>
              </div>
            )}
          </div>
        <div style={{ position: "relative" }}>
  {showPagesNavigation && <PagesNavBar />}

  <Filter
    style={{
       color :"green",
      position: "absolute",
      top: "60px", // висота PagesNavBar
      left: 0,
      zIndex: 100000, // щоб накладатися на вертикальне меню
    }}
  />
</div>

          
        </nav>
      </div>
    </div>
  );
}

export default NavBar;
