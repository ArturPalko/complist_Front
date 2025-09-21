import React, { useEffect } from "react";
import s from './PagesNavBar.module.css';
import { NavLink, useLocation } from 'react-router-dom';
import { connect } from "react-redux";
import { govUaCount, lotusCount, phonesCount } from "../../../redux/selectors/selector";
import { rememberCurrentPagesActionCreator } from "../../../redux/pagesNavbar-reducer";

const PagesNavBar = (props) => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

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
    props.rememberCurrentPage(pageName, pageFromURL);
  }, [location.pathname, pageName, pageFromURL]);

  return (
    <div className={s.navigationOfPage}>
      {Array.from({ length: countOfPages }, (_, i) => {
        const pageNumber = i + 1;
        return (
          <NavLink
            key={i}
            to={`${basePath}${pageNumber}`}
            className={({ isActive }) =>
              `${s.pageNavigator} ${isActive ? s.activeLink : ""}`
            }
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
  govUaCount: govUaCount(state)
});

const mapDispatchToProps = { rememberCurrentPage: rememberCurrentPagesActionCreator };

export default connect(mapStateToProps, mapDispatchToProps)(PagesNavBar);
