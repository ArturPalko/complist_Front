import { redirectToPage } from "../../../../Components/NavBar/commonFunctions";

export const redirectToCurrentPage = ({
  filters = {},
  subConditions = {},
  lastPage,
  hasAnyFiltersFn,
  navigate,
  activeMenu,
  currentPage
}) => {
  // якщо ми вже на сторінці foundResults — нічого не робимо
  if (lastPage === "foundResults") return;

  // перевіряємо, чи є активні фільтри
  const hasFilters = hasAnyFiltersFn(filters, subConditions);

  // якщо фільтри є, переходимо на сторінку 1, інакше залишаємося на поточній
  const nextPage = hasFilters ? 1 : currentPage;
debugger;
  // викликаємо функцію редіректу
  redirectToPage(
    {
      navigate,
      currentPage: nextPage,
      activeMenu
    }
  );
};
