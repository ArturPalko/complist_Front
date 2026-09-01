import { redirectToPage } from "../../../../shared/functions/redirectToPage";

let prevMenu = null;

export const redirectToCurrentPage = ({
  hasFilters,
  navigate,
  activeMenu,
  viewMode,
  currentPage
}) => {
  if (prevMenu !== null && prevMenu !== activeMenu) {
    prevMenu = activeMenu;
    return;
  }

  prevMenu = activeMenu;

  const nextPage = hasFilters ? 1 : currentPage;
  
  redirectToPage({
    navigate,
    currentPage: nextPage,
    activeMenu,
    viewMode
  });
};