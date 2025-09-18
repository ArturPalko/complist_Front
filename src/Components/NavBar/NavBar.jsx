import React, { useState } from 'react';
import s from './NavBar.module.css';
import { NavLink } from 'react-router-dom';
import PagesNavBar from './PagesNavBar/PagesNavBar';
import { useParams, useLocation } from "react-router-dom";

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
          {showPagesNavigation && <PagesNavBar />}
        </nav>
      </div>
    </div>
  );
}

export default NavBar;
