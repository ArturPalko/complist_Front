import { redirectToPage } from "../../../../Components/NavBar/commonFunctions";

export const redirectToCurrentPage = ({
  hasFilters,
  isLastVisitedPageWasFoundResults,
  navigate,
  activeMenu,
  currentPage
}) => {
debugger;
  if (isLastVisitedPageWasFoundResults) return;

  const nextPage = hasFilters ? 1 : currentPage;

  redirectToPage(
    {
      navigate,
      currentPage: nextPage,
      activeMenu
    }
  );
};
