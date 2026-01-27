import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import s from "./NavBar.module.css";

import PagesNavBar from "./PagesNavBar/PagesNavBar";
import Filter from "./Filter/Filter";

import { Pages } from "../../redux/selectors/constants";
import { pageConfigs } from "../../redux/selectors/pageConfig";

function NavBar() {
  const [showDropdown, setShowDropdown] = useState(true);
  const [showPagesNavigation, setShowPagesNavigation] = useState(true);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
    setShowPagesNavigation((prev) => !prev);
  };

  const navItems = [
    { page: Pages.GOV_UA, label: "GOV-UA скриньки" },
    { page: Pages.LOTUS, label: "Lotus скриньки" },
    { page: Pages.PHONES, label: "Телефони" },
  ];

  return (
    <div className="nav">
      <nav>
        <div className={s.item}>
          <button
            onClick={toggleDropdown}
            className={s.dropdownBtn}
          >
            Довідники {showDropdown ? "▲" : "▼"}
          </button>

          {showDropdown && (
            <div className={s.dropdownContent}>
              {navItems.map(({ page, label }) => (
                <NavLink
                  key={page}
                  to={pageConfigs[page].basePath}
                  className={({ isActive }) =>
                    isActive ? s.activeLink : undefined
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          {showPagesNavigation && <PagesNavBar />}

          <Filter
            style={{
              color: "green",
              position: "absolute",
              top: "60px",
              left: 0,
              zIndex: 100000,
            }}
          />
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
