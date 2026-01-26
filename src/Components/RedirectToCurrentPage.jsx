import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  activeMenu,
  currentPageByMenu,
  getCurentFilterPage,
  getLastVisitedPage,
  isFilterAppliedSelector,
  isSearchValueFoundByPage
} from "../redux/selectors/selector";
import { Pages } from "../redux/selectors/constants";

const RedirectToCurrentPage = ({ buildPath, redirectMenu }) => {
  const menuFromStore = useSelector(activeMenu);
  const menu = redirectMenu || menuFromStore;

  const isFilterApplied = useSelector(state =>
    isFilterAppliedSelector(menu)(state)
  );

  const pageFromSelector = useSelector(state =>
    currentPageByMenu(state, menu)
  );

  const pageFromFilter = useSelector(state =>
    getCurentFilterPage(state, menu)
  );

  const lastVisitedPage = useSelector(state =>
    getLastVisitedPage(state, menu)
  );

  // Перевірка, чи є знайдені результати на будь-якій сторінці
  const hasFoundResultsOnAnyPage = useSelector(state =>
    Object.values(Pages).some(pageKey => isSearchValueFoundByPage(pageKey)(state))
  );

  let page = isFilterApplied ? pageFromFilter : pageFromSelector;

  // Якщо знайдені результати є на будь-якій сторінці — редиректимо на lastVisitedPage
  if (hasFoundResultsOnAnyPage) {
    page = lastVisitedPage;
  }

  if (!page) return null;

  return <Navigate to={buildPath(page)} replace />;
};

export default RedirectToCurrentPage;
