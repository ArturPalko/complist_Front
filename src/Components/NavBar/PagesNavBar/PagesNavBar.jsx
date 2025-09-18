import React from 'react';
import s from './PagesNavBar.module.css';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import {govUaCount, lotusCount, phonesCount} from  "../../../redux/selectors/selector";


const PagesNavBar = ({govUaCount, lotusCount, phonesCount}) => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean); // ['phones','2'] або ['mails','Lotus','3']
  console.log("phones count" + phonesCount)
  let countOfPages = 0;
  let basePath = "";

  if (pathParts[0] === "phones") {
    countOfPages = phonesCount;
    basePath = "/phones/";
  } else if (pathParts[0] === "mails") {
    if (pathParts[1] === "Lotus") {
      countOfPages = lotusCount;
      basePath = "/mails/Lotus/";
    } else if (pathParts[1] === "Gov-ua") {
      countOfPages = govUaCount;
      basePath = "/mails/Gov-ua/";
    }
  }

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
const mapStateToProps = (state) => ({ phonesCount:phonesCount(state),lotusCount:lotusCount(state),govUaCount:govUaCount(state) });
const mapDispatchToProps = {  };

export default connect(mapStateToProps, mapDispatchToProps)(PagesNavBar);

