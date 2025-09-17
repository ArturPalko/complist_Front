import React from 'react';
import s from './PagesNavBar.module.css';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";

const PagesNavBar = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean); // ['phones','2'] або ['mails','Lotus','3']

// Безпечні селектори
  const phonesCount = useSelector((state) => state.phones?.phones?.length || 0);
  const lotusCount = useSelector((state) => state.mails?.mails?.lotus?.length || 0);
  const govUaCount = useSelector((state) => state.mails?.mails?.["gov-ua"]?.length || 0);

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

export default PagesNavBar;
