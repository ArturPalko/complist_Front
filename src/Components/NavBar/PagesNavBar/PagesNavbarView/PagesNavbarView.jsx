import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import s from "./PagesNavBarView.module.css";
import { useDragContext } from "../../../../redux/contexts/useConetxt";

const PagesNavBarView = ({
  basePath,
  count,
  showFoundResultPage,
  isFoundResultsPage,
  indexes,
  handleNavLinkPressed,
  handleNavLinkUnpressed,
  handleDropOnPage,
}) => {
  const navigate = useNavigate();
  const { dragId, endDrag } = useDragContext();

  const goToPage = (page) => {
    if (!dragId) return;
    navigate(`${basePath}${page}`);
  };

  return (
    <div className={s.navigationOfPage}>
      {/* FOUND RESULTS */}
      {(showFoundResultPage || isFoundResultsPage) && (
        <NavLink
          to={`${basePath}foundResults`}
          onClick={endDrag}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => goToPage("foundResults")}
          onDrop={() => {
            handleDropOnPage?.("foundResults");
            endDrag();
          }}
          className={({ isActive }) =>
            `${s.pageNavigator} ${s.foundResultsPage} ${
              isActive ? s.activeLink : ""
            }`
          }
        >
          R
        </NavLink>
      )}

      {/* PAGES */}
      {count > 0 &&
        Array.from({ length: count }, (_, i) => {
          const pageNumber = i + 1;

          return (
            <div
              key={pageNumber}
              onDragOver={(e) => e.preventDefault()} // 🔥 дозволяє drop
              onDragEnter={() => goToPage(pageNumber)} // 🔥 auto navigate
              onDrop={() => {
                handleDropOnPage?.(pageNumber);
                endDrag();
              }}
              className={s.pageWrapper}
            >
              <NavLink
                to={`${basePath}${pageNumber}`}
                onClick={endDrag}
                onMouseDown={handleNavLinkPressed}
                onMouseUp={handleNavLinkUnpressed}
                onMouseLeave={handleNavLinkUnpressed}
                className={({ isActive }) =>
                  `${s.pageNavigator} ${
                    isActive ? s.activeLink : ""
                  } ${
                    indexes.includes(pageNumber)
                      ? s.containsSearchedValues
                      : ""
                  }`
                }
              >
                {pageNumber}
              </NavLink>
            </div>
          );
        })}
    </div>
  );
};

export default PagesNavBarView;