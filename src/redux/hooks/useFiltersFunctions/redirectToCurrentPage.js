import { redirectToPage } from "../../../Components/NavBar/commonFunctions.js";

export const redirectToCurrentPage = ({
  filters = {},
  subConditions = {},
  lastPage,
  hasAnyFiltersFn,
  navigate,
  activeMenu,
  GovUaCurrentPage,
  lotusCurrentPage,
  phonesCurrentPage
}) => {
  if (lastPage === "foundResults") return;

  const hasFilters = hasAnyFiltersFn(filters, subConditions);
  debugger;

  const pageParams = { navigate, activeMenu, GovUaCurrentPage, lotusCurrentPage, phonesCurrentPage };

  if (hasFilters) {
    if (activeMenu === "Gov-ua") pageParams.GovUaCurrentPage = 1;
    else if (activeMenu === "Lotus") pageParams.lotusCurrentPage = 1;
    else if (activeMenu === "phones") pageParams.phonesCurrentPage = 1;
  }
  debugger;
  redirectToPage(pageParams);
  
};
