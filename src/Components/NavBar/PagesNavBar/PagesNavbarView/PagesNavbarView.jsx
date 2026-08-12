import React, { useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import s from "./PagesNavBarView.module.css";
import { useDragContext } from "../../../../redux/contexts/useConetxt";

const PagesNavBarView = ({
  editMode,
  basePath,
  count,
  showFoundResultPage,
  isFoundResultsPage,
  indexes,
  handleNavLinkPressed,
  handleNavLinkUnpressed,
  handleDropOnPage,
  searchMode,
}) => {
  const navigate = useNavigate();
  const { dragIds, endDrag } = useDragContext();

  const pendingPageRef = useRef(null);
  const timerRef = useRef(null);

  const isDragActive = Boolean(editMode && dragIds?.length);

  const isSearchFilterMode = searchMode === "filter";

  const goToPage = (page) => {
    if (!isDragActive) return;

    pendingPageRef.current = page;

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      navigate(`${basePath}${pendingPageRef.current}`);
    }, 300);
  };

  const cancelPageSwitch = () => {
    clearTimeout(timerRef.current);
    pendingPageRef.current = null;
  };

  return (
    <div
      className={`${s.navigationOfPage} ${
        isDragActive ? s.editMode : ""
      }`}
    >
      {/* FOUND RESULTS — ONLY NORMAL SEARCH MODE */}
      {!isSearchFilterMode &&
        (showFoundResultPage || isFoundResultsPage) &&
        !isDragActive && (
          <NavLink
            to={`${basePath}foundResults`}
            className={({ isActive }) =>
              `${s.foundResultsPage} ${
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
              className={`${s.pageWrapper} ${
                isDragActive ? s.dragActive : ""
              }`}
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
                    !isSearchFilterMode &&
                    indexes.includes(pageNumber)
                      ? s.containsSearchedValues
                      : ""
                  }`
                }
              >
                {pageNumber}

                {/* ARROW ONLY IN DRAG MODE */}
                {isDragActive && (
                  <span className={s.dragArrow}>›››</span>
                )}
              </NavLink>
            </div>
          );
        })}
    </div>
  );
};

export default PagesNavBarView;