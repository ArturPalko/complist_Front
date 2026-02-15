import { redirectToPage } from "../../../../Components/NavBar/commonFunctions";

// Зберігаємо попереднє меню на рівні замикання модуля
let prevMenu = null;

export const redirectToCurrentPage = ({
  hasFilters,
  isLastVisitedPageWasFoundResults,
  navigate,
  activeMenu,
  currentPage
}) => {
  // Якщо змінилося активне меню — пропускаємо редирект
  if (prevMenu !== null && prevMenu !== activeMenu) {
    prevMenu = activeMenu; // оновлюємо значення
    return;
  }

  prevMenu = activeMenu;

  if (isLastVisitedPageWasFoundResults) return;

  const nextPage = hasFilters ? 1 : currentPage;

  redirectToPage({
    navigate,
    currentPage: nextPage,
    activeMenu
  });
};
