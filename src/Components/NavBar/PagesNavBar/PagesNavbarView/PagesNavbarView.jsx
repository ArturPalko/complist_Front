import React, { useEffect, useRef, useState } from "react";
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
  const { dragIds, endDrag } = useDragContext();

  // 🔥 pending page switch (fix for dragEnter bug)
  const pendingPageRef = useRef(null);
  const timerRef = useRef(null);

  const goToPage = (page) => {
    if (!dragIds || dragIds.length === 0) return;

    pendingPageRef.current = page;

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      navigate(`${basePath}${pendingPageRef.current}`);
    }, 300); // 🔥 debounce for stable drag
  };

  const cancelPageSwitch = () => {
    clearTimeout(timerRef.current);
    pendingPageRef.current = null;
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
          onDragLeave={cancelPageSwitch}
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
              className={s.pageWrapper}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => goToPage(pageNumber)}
              onDragLeave={cancelPageSwitch}
              onDrop={() => {
                handleDropOnPage?.(pageNumber);
                endDrag();
              }}
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