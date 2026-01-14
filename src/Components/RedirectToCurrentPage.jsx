import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCurentFilterPage, isFilterAppliedSelector, getLastVisitedPage, isSearchValueFoundByPage } from "../redux/selectors/selector";

const RedirectToCurrentPage = ({ selector, buildPath, redirectMenu }) => {
  const menu = redirectMenu;

  const isApplied = useSelector(state => isFilterAppliedSelector(menu)(state));
  const currentPageFromFilter = useSelector(state => getCurentFilterPage(state, menu));
  const currentPageFromSelector = useSelector(selector);
  const lastVisitedPage = useSelector(state => getLastVisitedPage(state, menu));

  // Використовуємо універсальні селектори для всіх сторінок
  const isPhonesFound = useSelector(isSearchValueFoundByPage("phones"));
  const isLotusFound = useSelector(isSearchValueFoundByPage("Lotus"));
  const isGovUaFound = useSelector(isSearchValueFoundByPage("Gov-ua"));

  let currentPage = isApplied ? currentPageFromFilter : currentPageFromSelector;

  // Якщо будь-яка сторінка містить foundResults
  if (isPhonesFound || isLotusFound || isGovUaFound) {
    currentPage = lastVisitedPage;
  }

  if (!currentPage) return null;

  return <Navigate to={buildPath(currentPage)} replace />;
};

export default RedirectToCurrentPage;
