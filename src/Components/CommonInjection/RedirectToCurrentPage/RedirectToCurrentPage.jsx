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
} from "../../../redux/selectors/selector";

import { Pages } from "../../../configs/app/constants";
import { pageConfigs } from "../../../configs/app/pageConfig";

const RedirectToCurrentPage = ({ redirectMenu }) => {

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

  const hasFoundResultsOnAnyPage = useSelector(state =>
    Object.values(Pages).some(pageKey =>
      isSearchValueFoundByPage(pageKey)(state)
    )
  );

  /* =========================
     config
  ========================= */
  const config = pageConfigs[menu];
  if (!config) return null;

  /* =========================
     page resolve
  ========================= */
  let page = isFilterApplied ? pageFromFilter : pageFromSelector;

  if (hasFoundResultsOnAnyPage) {
    page = lastVisitedPage;
  }

  if (!page) return null;

  return <Navigate to={`${config.basePath}${page}`} replace />;
};

export default RedirectToCurrentPage;
