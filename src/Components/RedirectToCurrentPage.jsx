import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { activeMenu, getCurentFilterPage, isFilterAppliedSelector } from "../redux/selectors/selector";

const RedirectToCurrentPage = ({ selector, buildPath, redirectMenu }) => {
  const dispatch = useDispatch();
  const menu = redirectMenu;
  const isApplied = useSelector(state => isFilterAppliedSelector(menu)(state));
  const currentPageFromFilter = useSelector(state => getCurentFilterPage(state, menu));
  const currentPageFromSelector = useSelector(selector);

  const currentPage = isApplied ? currentPageFromFilter : currentPageFromSelector;

 
  if (!currentPage) return null;

  return <Navigate to={buildPath(currentPage)} replace />;
};

export default RedirectToCurrentPage;
