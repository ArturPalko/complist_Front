import React, { useEffect, useState, useRef } from "react";
import s from './PagesNavBar.module.css';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { connect } from "react-redux";
import { 
  selectPaginationPagesCount,
  getCountOfPageForFiltredResults,
  activeMenu,
  isFilterAppliedSelector,
  selectSearchValueByPage,
  isSearchValueFoundByPage
} from "../../../redux/selectors/selector";

import { 
  rememberCurrentPagesActionCreator, 
  setFilterPage, 
  setLastVisitedPage 
} from "../../../redux/pagesNavbar-reducer";

import { togglepagesNavbarLinkElementOnCurrentPage } from "../../../redux/toggledElements-reducer";

const PagesNavBar = (props) => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const [showFoundResultPage, setShowFoundResultsPage] = useState(false);
  const [indexes, setIndexes] = useState([]);
  const pressTimer = useRef(null);
  const isPressed = useRef(false); 
  const keysToKeep = ["currentPage"];
  const delay = 1000;

  const navigate = useNavigate();

  // --- Визначаємо базові змінні
  let pageName = "";
  let basePath = "";
  let pageFromURL = "1";

  if (pathParts[0] === "phones") {
    pageName = "phones";
    basePath = "/phones/";
    pageFromURL = pathParts[1];
  } else if (pathParts[0] === "mails") {
    if (pathParts[1] === "Lotus") {
      pageName = "Lotus";
      basePath = "/mails/Lotus/";
      pageFromURL = pathParts[2];
    } else if (pathParts[1] === "Gov-ua") {
      pageName = "Gov-ua";
      basePath = "/mails/Gov-ua/";
      pageFromURL = pathParts[2];
    }
  }

  const isFoundResultsPage = pageFromURL === "foundResults";

  // --- Підрахунок кількості сторінок
  let count = props.countFiltred(props.activeMenu);

  if ((!count || count.length === 0) && !props.isFilterAppliedSelector(pageName)) {
    count = props.pagesCount; // базова кількість сторінок до появи даних фільтру
  }

  // --- Обробники натискання на NavLink
  const handleNavLinkPressed = (e) => {
    if (pageFromURL === e.currentTarget.textContent) {
      pressTimer.current = setTimeout(() => {
        props.togglepagesNavbarLinkElementOnCurrentPage(true);
        isPressed.current = true;
      }, delay);
    }
  };

  const handleNavLinkUnpressed = () => {
    clearTimeout(pressTimer.current);
    if (isPressed.current) {
      props.togglepagesNavbarLinkElementOnCurrentPage(false);
    }
  };

  // --- Отримуємо foundResults для сторінки
  let foundResults;
  switch(pageName) {
    case "phones":
      foundResults = props.foundSearchValueOfPhonesPage?.foundResults;
      break;
    case "Lotus":
      foundResults = props.foundSearchValueOfLotusMailsPage?.foundResults;
      break;
    case "Gov-ua":
      foundResults = props.foundSearchValueOfGovUaPage?.foundResults;
      break;
    default:
      foundResults = [];
  }

  // --- Effect для оновлення останніх відвіданих сторінок
  useEffect(() => {
    const isApplied = props.isFilterAppliedSelector(pageName);

    if(pageName && pageFromURL) {
      if(isApplied && foundResults?.length > 0) {
        props.setLastVisitedPage(pageName, pageFromURL);
        if(pageFromURL !== "foundResults") props.setFilterPage(pageName, pageFromURL);
      } else if(!isApplied) {
        props.rememberCurrentPage(pageName, pageFromURL);
      } else if(isApplied && foundResults?.length === 0) {
        props.setFilterPage(pageName, pageFromURL);
        props.setLastVisitedPage(pageName, pageFromURL);
      }
    }
  }, [location.pathname, pageName, pageFromURL, foundResults]);

  // --- Effect для обробки пошуку
  useEffect(() => {
    const active = props.activeMenu;
    const isFound = 
      (active === "phones" && props.isPhonesSearchValueFound) || 
      (active === "Lotus" && props.isLotusSearchValueFounded) ||
      (active === "Gov-ua" && props.isGovUaSearchValueFounded);

    if (isFound) {
      setShowFoundResultsPage(true);

      // Обчислюємо індекси знайдених результатів
      switch(active) {
        case "phones":
          foundResults = props.foundSearchValueOfPhonesPage?.foundResults;
          break;
        case "Lotus":
          foundResults = props.foundSearchValueOfLotusMailsPage?.foundResults;
          break;
        case "Gov-ua":
          foundResults = props.foundSearchValueOfGovUaPage?.foundResults;
          break;
        default:
          foundResults = [];
      }

      const index = foundResults.map(result =>
        Object.fromEntries(
          Object.entries(result).filter(([key]) => keysToKeep.includes(key))
        )
      );

      const newIndexes = Object.values(index).map(obj => Object.values(obj));
      setIndexes(newIndexes);
    } else {
      setShowFoundResultsPage(false);
      setIndexes([]);
    }
  }, [
    props.activeMenu,
    props.isPhonesSearchValueFound,
    props.isLotusSearchValueFounded,
    props.isGovUaSearchValueFounded,
    props.foundSearchValueOfPhonesPage,
    props.foundSearchValueOfLotusMailsPage,
    props.foundSearchValueOfGovUaPage
  ]);

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
              key={i}
              to={`${basePath}${pageNumber}`}
              onMouseDown={handleNavLinkPressed}
              onMouseUp={handleNavLinkUnpressed}
              onDragStart={e => e.preventDefault()}
              onMouseLeave={() => {
                clearTimeout(pressTimer.current);
                props.togglepagesNavbarLinkElementOnCurrentPage(false);
              }}
              className={({ isActive }) => `
                ${s.pageNavigator}
                ${isActive ? ` ${s.activeLink}` : ""}
                ${indexes.some(page => page.includes(pageNumber)) ? ` ${s.containsSearchedValues}` : ""}
              `}
            >
              {pageNumber}
            </NavLink>
          );
        })
      }
    </div>
  );
};

// --- mapStateToProps
const mapStateToProps = (state) => ({
  activeMenu: activeMenu(state),
  pagesCount: selectPaginationPagesCount(activeMenu(state))(state),

  isPhonesSearchValueFound: isSearchValueFoundByPage("phones")(state),
  isGovUaSearchValueFounded: isSearchValueFoundByPage("gov-ua")(state),
  isLotusSearchValueFounded: isSearchValueFoundByPage("lotus")(state),

  foundSearchValueOfPhonesPage: selectSearchValueByPage("phones")(state),
  foundSearchValueOfLotusMailsPage: selectSearchValueByPage("lotus")(state),
  foundSearchValueOfGovUaPage: selectSearchValueByPage("gov-ua")(state),

  countFiltred: (menu) => getCountOfPageForFiltredResults(state, menu),
  isFilterAppliedSelector: (menu) => isFilterAppliedSelector(menu)(state),
});

// --- mapDispatchToProps
const mapDispatchToProps = { 
  rememberCurrentPage: rememberCurrentPagesActionCreator,
  togglepagesNavbarLinkElementOnCurrentPage,
  setFilterPage,
  setLastVisitedPage
};

export default connect(mapStateToProps, mapDispatchToProps)(PagesNavBar);
