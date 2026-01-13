// PagesNavBarView.js
import React from "react";
import { NavLink } from "react-router-dom";
import s from "./PagesNavBarView.module.css";

const PagesNavBarView = ({
  basePath,
  count,
  showFoundResultPage,
  isFoundResultsPage,
  indexes,
  handleNavLinkPressed,
  handleNavLinkUnpressed,
}) => {
  return (
    <div className={s.navigationOfPage}>
      {(showFoundResultPage || isFoundResultsPage) && (
        <NavLink
          to={`${basePath}foundResults`}
          className={({ isActive }) =>
            `${s.pageNavigator} ${s.foundResultsPage} ${isActive ? s.activeLink : ""}`
          }
        >
          R
        </NavLink>
      )}

      {count > 0 &&
        Array.from({ length: count }, (_, i) => {
          const pageNumber = i + 1;
          return (
            <NavLink
              key={pageNumber}
              to={`${basePath}${pageNumber}`}
              onMouseDown={handleNavLinkPressed}
              onMouseUp={handleNavLinkUnpressed}
              onMouseLeave={handleNavLinkUnpressed}
              onDragStart={(e) => e.preventDefault()}
              className={({ isActive }) =>
                `${s.pageNavigator} ${isActive ? s.activeLink : ""} ${
                  indexes.includes(pageNumber) ? s.containsSearchedValues : ""
                }`
              }
            >
              {pageNumber}
            </NavLink>
          );
        })}
    </div>
  );
};

export default PagesNavBarView;
