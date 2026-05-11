import  { useState } from "react";
import { NavLink } from "react-router-dom";
import s from "./NavBar.module.css";

import PagesNavBar from "./PagesNavBar/PagesNavBar";
import Filter from "./Filter/Filter";

import { Pages } from "../../configs/app/constants";
import { pageConfigs } from "../../configs/app/pageConfig";
import { isEditModeSelected } from "../../redux/selectors/selector";
import { useSelector } from "react-redux";
import { useDragContext } from "../../redux/contexts/useConetxt";
import { useEffect } from "react";
import { clearFiltredData } from "../../redux/reducers/filter-data-reducer/filterData-reducer";
import { useDispatch } from "react-redux";

function NavBar() {
  const [showDropdown, setShowDropdown] = useState(true);
  const [showPagesNavigation, setShowPagesNavigation] = useState(true);
  const showFilterPanel = !useSelector(isEditModeSelected)
  const dispatch = useDispatch()
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
    setShowPagesNavigation((prev) => !prev);
  };
  const isEditMode = useSelector(isEditModeSelected)
  useEffect(() => {
  if (isEditMode) {
    dispatch(clearFiltredData());
  }
}, [isEditMode]);

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
          {showPagesNavigation && <PagesNavBar />}
          { showFilterPanel && <Filter/>} 
      </nav>
    </div>
  );
}

export default NavBar;
