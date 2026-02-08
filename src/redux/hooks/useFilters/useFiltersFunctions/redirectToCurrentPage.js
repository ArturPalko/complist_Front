import { redirectToPage } from "../../../../Components/NavBar/commonFunctions";

export const redirectToCurrentPage = ({
  filters = {},
  subConditions = {},
  lastPageWasFoundResults,
  hasAnyFiltersFn,
  navigate,
  activeMenu,
  currentPage
}) => {

  // якщо ми вже на сторінці foundResults — нічого не робимо
  if (lastPageWasFoundResults) return;

  // перевіряємо, чи є активні фільтри
  const hasFilters = hasAnyFiltersFn(filters, subConditions);

  // якщо фільтри є, переходимо на сторінку 1, інакше залишаємося на поточній
  const nextPage = hasFilters ? 1 : currentPage;

  // викликаємо функцію редіректу
  redirectToPage(
    {
      navigate,
      currentPage: nextPage,
      activeMenu
    }
  );
};
