import React, { useState } from 'react';
import s from './NavBar.module.css';
import { NavLink } from 'react-router-dom';
import PagesNavBar from './PagesNavBar/PagesNavBar';
import { useParams, useLocation } from "react-router-dom";

function NavBar() {
  const [showDropdown, setShowDropdown] = useState(true);
  const [showPhonePagesNavigation, setshowPhonePagesNavigation] = useState(true);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const togglePagesNavigation = () => {
    setshowPhonePagesNavigation(prev => !prev);
  }
  const params = useParams();
  const pageNumber = Number(params.pageNumber) || 1
  const pathState = useLocation();
  const currentPath = pathState.

  return (
    <div>
      <div className="nav">
        <nav>
          <div className={s.item}>
            <button onClick={toggleDropdown} className={s.dropdownBtn}>
              Довідники {showDropdown ? "▲" : "▼"}
            </button>
            {showDropdown && (
              <div className={s.dropdownContent}>
                <NavLink
                  to="/mails/Gov-ua"
                  className={({ isActive }) => (isActive ? s.activeLink : undefined)}
                >
                  GOV-UA скриньки
                </NavLink>
                <NavLink
                  to="/mails/Lotus"
                  className={({ isActive }) => (isActive ? s.activeLink : undefined)}
                >
                  Lotus скриньки
                </NavLink>
                <NavLink
                  to="/phones"
                  className={({ isActive }) => (isActive ? s.activeLink : undefined)}
                  onClick={togglePagesNavigation} 
                >
                  Телефони
                </NavLink>
              </div>
            )}
          </div>
          {showPhonePagesNavigation && <PagesNavBar />}
        </nav>
      </div>
    </div>
  );
}

export default NavBar;
