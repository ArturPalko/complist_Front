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
  if (lastPage === "foundResults") return;

  const hasFilters = hasAnyFiltersFn(filters, subConditions);

  const nextPage = hasFilters ? 1 : currentPage;


  redirectToPage(
    {
      navigate,
      activeMenu,
      currentPage: nextPage
    },
    activeMenu,
    navigate
  );
};
