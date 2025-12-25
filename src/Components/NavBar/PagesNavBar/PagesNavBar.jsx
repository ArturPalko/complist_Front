import React, { useEffect, useState,useRef } from "react";
import s from './PagesNavBar.module.css';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { connect } from "react-redux";
import { govUaCount, lotusCount, phonesCount, isPhonesSearchValueFound, foundSearchValueOfPhonesPage, 
  getPhones, getPhonesCurrentPageNumber, activeMenu, isGovUaSearchValueFounded, isLotusSearchValueFounded, 
  foundSearchValueOfLotusMailsPage, foundSearchValueOfGovUaPage, getCountOfPageForFiltredResults, lotusCurrentPage,
   GovUaCurrentPage, phonesCurrentPage,
   isFilterAppliedSelector,
   isCurrentPageFoundResult} from "../../../redux/selectors/selector";
import { rememberCurrentPagesActionCreator, setFilterPage, setLastVisitedPage, } from "../../../redux/pagesNavbar-reducer";
import { togglepagesNavbarLinkElementOnCurrentPage } from "../../../redux/toggledElements-reducer";


const PagesNavBar = (props) => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const [showFoundResultPage, setShowFoundResultsPage]= useState(false);
  const keysToKeep = ["currentPage"];
  const [indexes, setIndexes] = useState([]);
  const pressTimer = useRef(null);
  const isPressed = useRef(false); 
  const delay = 1000;
  const navigate = useNavigate();
  let isFoundResultsPage;

  let countOfPages = 0;
  let basePath = "";
  let pageName = "";
  let pageFromURL = "1";

  if (pathParts[0] === "phones") {
    countOfPages = props.phonesCount;
    basePath = "/phones/";
    pageName = "phones";
    pageFromURL = pathParts[1];

  } else if (pathParts[0] === "mails") {
    if (pathParts[1] === "Lotus") {
      countOfPages = props.lotusCount;
      basePath = "/mails/Lotus/";
      pageName = "Lotus";
      pageFromURL = pathParts[2];

    } else if (pathParts[1] === "Gov-ua") {
      countOfPages = props.govUaCount;
      basePath = "/mails/Gov-ua/";
      pageName = "Gov-ua";
      pageFromURL = pathParts[2];

    }
  }
  isFoundResultsPage=pageFromURL== "foundResults";

  let count = props.countFiltred(props.activeMenu);
  if ((!count || count.length === 0) && props.isFilterAppliedSelector(pageName) === false) {
    count = countOfPages; // базова кількість сторінок до того, як дані з фільтру з'являться
  }

  function handleNavLinkPressed(e) {
    if (pageFromURL === e.currentTarget.textContent) {
      pressTimer.current = setTimeout(() => {
        props.togglepagesNavbarLinkElementOnCurrentPage(true);
        isPressed.current = true;
      }, delay);
    }
  }

  function handleNavLinkUnpressed() {
    clearTimeout(pressTimer.current);
    if (isPressed.current) {
      console.log("При кліку")
      props.togglepagesNavbarLinkElementOnCurrentPage(false);
    }
  }

  // 🔹 Визначаємо foundResults для всіх подальших перевірок
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
      foundResults = null;
  }

  useEffect(() => {
    const isApplied = props.isFilterAppliedSelector(pageName);
    if(pageName &&pageFromURL  && isApplied && foundResults?.length>0)
    {
      props.setLastVisitedPage(pageName,pageFromURL)
      if(pageFromURL !="foundResults")
      props.setFilterPage(pageName,pageFromURL)
    }
    if (pageName &&pageFromURL  && !isApplied) {
       props.rememberCurrentPage(pageName, pageFromURL);
    }
    if(pageName &&pageFromURL && isApplied && foundResults?.length==0){
      props.setFilterPage(pageName, pageFromURL)
      props.setLastVisitedPage(pageName,pageFromURL)
    }
  }, [location.pathname, pageName, pageFromURL, foundResults]);

  let activeMenu = props.activeMenu;

  useEffect(() => {
    //console.log("ак-к-к",props.isPhonesSearchValueFound);
    if ((activeMenu === "phones" && props.isPhonesSearchValueFound) || 
        (activeMenu === "Lotus" && props.isLotusSearchValueFounded) ||
        (activeMenu === "Gov-ua" && props.isGovUaSearchValueFounded)) {
      
      setShowFoundResultsPage(true);
      console.log("Значення для відображення:", showFoundResultPage);

      // 🔹 Визначаємо foundResults у залежності від активного меню
      switch(activeMenu){
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
      
      console.log("FoundResults::::::",foundResults)

      const index = foundResults.map(result =>
        Object.fromEntries(
          Object.entries(result).filter(([key]) => keysToKeep.includes(key))
        )
      );

      const indexes = Object.values(index).map(obj => Object.values(obj));
      setIndexes(indexes);

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
    props.foundSearchValueOfGovUaPage, 
    props.foundSearchValueOfLotusMailsPage
  ]);
  return (
    <div className={s.navigationOfPage}>
      {(showFoundResultPage ||isFoundResultsPage) && (
        <NavLink
          to={`${basePath}foundResults`}
          className={({ isActive }) =>
            `${s.pageNavigator} ${s.foundResultsPage} ${isActive ? s.activeLink : ""}`
          }
        >
          R
        </NavLink>
      )}

      {count >0 &&
       Array.from({ length: count }, (_, i) => {
        const pageNumber = i + 1;
        return (
          <NavLink
            onMouseDown={handleNavLinkPressed}
            onMouseUp={handleNavLinkUnpressed}
            onDragStart={e => e.preventDefault()}
            onMouseLeave={() => {
              clearTimeout(pressTimer.current);
              props.togglepagesNavbarLinkElementOnCurrentPage(false);
            }}
            key={i}
            to={`${basePath}${pageNumber}`}
            className={({ isActive }) => `
              ${s.pageNavigator}
              ${isActive ? ` ${s.activeLink}` : ""}
              ${indexes.some(page => page.includes(i + 1)) ? ` ${s.containsSearchedValues}` : ""}
            `}
          >
            {pageNumber}
          </NavLink>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state) => ({
  activeMenu:activeMenu(state),
  phonesCount: phonesCount(state),
  lotusCount: lotusCount(state),
  govUaCount: govUaCount(state),
  isPhonesSearchValueFound:isPhonesSearchValueFound(state),
  isGovUaSearchValueFounded:isGovUaSearchValueFounded(state),
  isLotusSearchValueFounded:isLotusSearchValueFounded(state),
  foundSearchValueOfPhonesPage: foundSearchValueOfPhonesPage(state),
  foundSearchValueOfLotusMailsPage:foundSearchValueOfLotusMailsPage(state),
  foundSearchValueOfGovUaPage:foundSearchValueOfGovUaPage(state),
  getPhonesCurrentPageNumber:getPhonesCurrentPageNumber(state),
  countFiltred: (menu) => getCountOfPageForFiltredResults(state, menu),
  lotusCurrentPage:lotusCurrentPage(state),
  GovUaCurrentPage:GovUaCurrentPage(state),
  phonesCurrentPage:phonesCurrentPage(state),
  isFilterAppliedSelector: (menu) => isFilterAppliedSelector(menu)(state)
});

const mapDispatchToProps = { 
  rememberCurrentPage: rememberCurrentPagesActionCreator, 
  togglepagesNavbarLinkElementOnCurrentPage: togglepagesNavbarLinkElementOnCurrentPage,
  setFilterPage,
  setLastVisitedPage
};

export default connect(mapStateToProps, mapDispatchToProps)(PagesNavBar);
