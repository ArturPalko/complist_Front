import React, { useEffect, useState } from "react";
import s from './PagesNavBar.module.css';
import { NavLink, useLocation } from 'react-router-dom';
import { connect } from "react-redux";
import { govUaCount, lotusCount, phonesCount, isPhonesSearchValueFound, foundSearchValueOfPhonesPage } from "../../../redux/selectors/selector";
import { rememberCurrentPagesActionCreator } from "../../../redux/pagesNavbar-reducer";


const PagesNavBar = (props) => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const [showFoundResultPage, setShowFoundResultsPage]= useState(false);
  const keysToKeep = ["currentPage"];
  const [indexes, setIndexes] = useState([]);
  

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

 useEffect(() => {
  if (pageName) {
    props.rememberCurrentPage(pageName, pageFromURL);
  }
}, [location.pathname, pageName, pageFromURL]);

 useEffect(() => {
  console.log("ак-к-к",props.isPhonesSearchValueFound);
    if (props.isPhonesSearchValueFound /*|| props.isLotusSearchValueFounded || props.isGovUaSearchValueFounded*/) {
      setShowFoundResultsPage(true);
      console.log("Значення для відображення:", showFoundResultPage);
      
      let foundResults= props.foundSearchValueOfPhonesPage.foundResults;
        console.log("FoundResults::::::",foundResults)
        const index = foundResults.map(result =>
                                    Object.fromEntries(
                                        Object.entries(result).filter(([key]) => keysToKeep.includes(key))
                                    )
                                    );
        const indexes = Object.values(index).map(obj => Object.values(obj));
        console.log("Indexes::::::", indexes);
        setIndexes(indexes);
    } else {
      setShowFoundResultsPage(false);
    }
  }, [props.isPhonesSearchValueFound, props.isLotusSearchValueFounded, props.isGovUaSearchValueFounded, props.foundSearchValueOfPhonesPage]);

  return (
    <div className={s.navigationOfPage}>
      {showFoundResultPage && (
            <NavLink
              to={`${basePath}foundResults`}
              className={({ isActive }) =>
                `${s.pageNavigator} ${s.foundResultsPage} ${isActive ? s.activeLink : ""}`
              }
            >
              R
            </NavLink>
          )}


      {Array.from({ length: countOfPages }, (_, i) => {
        const pageNumber = i + 1;
        return (
          <NavLink
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
  phonesCount: phonesCount(state),
  lotusCount: lotusCount(state),
  govUaCount: govUaCount(state),
  isPhonesSearchValueFound:isPhonesSearchValueFound(state),
  foundSearchValueOfPhonesPage: foundSearchValueOfPhonesPage(state)

  
});

const mapDispatchToProps = { rememberCurrentPage: rememberCurrentPagesActionCreator };

export default connect(mapStateToProps, mapDispatchToProps)(PagesNavBar);
