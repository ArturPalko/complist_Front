import React from "react";
import s from './PagesNavBar.module.css';
import { NavLink } from 'react-router-dom';
import { usePagesNavBarLogic } from "../../../redux/hooks/usePageNavbarLogic";

const PagesNavBar = () => {
  const {
    pageName,
    basePath,
    pageFromURL,
    isFoundResultsPage,
    showFoundResultsPage,
    indexes,
    count,
    handleNavLinkPressed,
    handleNavLinkUnpressed,
    handleNavLinkLeave,
  } = usePagesNavBarLogic(); // все підключено всередині хуку

  return (
    <div className={s.navigationOfPage}>
      {(showFoundResultsPage || isFoundResultsPage) && (
        <NavLink to={`${basePath}foundResults`} className={({ isActive }) =>
          `${s.pageNavigator} ${s.foundResultsPage} ${isActive ? s.activeLink : ""}`
        }>
          R
        </NavLink>
      )}

      {count > 0 &&
        Array.from({ length: count }, (_, i) => {
          const pageNumber = i + 1;
          return (
            <NavLink
              key={i}
              to={`${basePath}${pageNumber}`}
              onMouseDown={handleNavLinkPressed}
              onMouseUp={handleNavLinkUnpressed}
              onMouseLeave={handleNavLinkLeave}
              className={({ isActive }) =>
                `${s.pageNavigator} ${isActive ? s.activeLink : ""} ${
                  indexes.some(page => page.includes(pageNumber)) ? s.containsSearchedValues : ""
                }`
              }
            >
              {pageNumber}
            </NavLink>
          );
        })
      }
    </div>
  );
};

export default PagesNavBar;
