import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { activeMenu, getCurentFilterPage, isFilterAppliedSelector, isPhonesSearchValueFound, isGovUaSearchValueFounded, isLotusSearchValueFounded, getLastVisitedPage } from "../redux/selectors/selector";

const RedirectToCurrentPage = ({ selector, buildPath, redirectMenu }) => {
  const dispatch = useDispatch();
  const menu = redirectMenu;
  const isApplied = useSelector(state => isFilterAppliedSelector(menu)(state));
  const currentPageFromFilter = useSelector(state => getCurentFilterPage(state, menu));
  const currentPageFromSelector = useSelector(selector);
  const foundSearchValueOfGovUaPage = useSelector(state => isPhonesSearchValueFound(state));
  const foundSearchValueOfLotusPage = useSelector(state => isLotusSearchValueFounded(state));
  const foundSearchValueOfPhones = useSelector(state => isPhonesSearchValueFound(state));
  const LastVisitedPage =useSelector(state=> getLastVisitedPage(state,menu)  );

  let currentPage = isApplied ? currentPageFromFilter : currentPageFromSelector;
  if(/*isApplied*/ (foundSearchValueOfGovUaPage || foundSearchValueOfLotusPage|| foundSearchValueOfPhones)){
    currentPage = LastVisitedPage
  }

 
  if (!currentPage) return null;
  return <Navigate to={buildPath(currentPage)} replace />;
};

export default RedirectToCurrentPage;
