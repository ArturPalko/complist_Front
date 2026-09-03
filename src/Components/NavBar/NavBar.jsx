import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import s from "./NavBar.module.css";

import PagesNavBar from "./PagesNavBar/PagesNavBar";
import Filter from "./Filter/Filter";

import { Pages } from "../../configs/app/constants";
import { pageConfigs } from "../../configs/app/pageConfig";
import {
  getCurrentMode,
  isEditModeSelected
} from "../../redux/selectors/selector";

import { clearFiltredData } from "../../redux/reducers/filter-data-reducer/filterData-reducer";
import { resetEditUiState } from "../../redux/reducers/ui-reducer";

function NavBar() {
  const [showDropdown, setShowDropdown] = useState(true);
  const [showPagesNavigation, setShowPagesNavigation] = useState(true);

  const mode = useSelector(getCurrentMode);
  const isEditMode = useSelector(isEditModeSelected);

  const dispatch = useDispatch();

  const showFilterPanel = !isEditMode;

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
    setShowPagesNavigation((prev) => !prev);
  };

  useEffect(() => {
    if (isEditMode) {
      dispatch(clearFiltredData());
    }
  }, [isEditMode, dispatch]);

  const handleNavigation = () => {
    if (mode) {
      dispatch(resetEditUiState());
    }
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
                  onClick={handleNavigation}
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

        {showFilterPanel && <Filter />}
      </nav>
    </div>
  );
}

export default NavBar;

