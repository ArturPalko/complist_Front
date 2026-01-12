import { useSelector } from "react-redux";
import {
  activeMenu,
  selectPaginationPagesCount,
  getCountOfPageForFiltredResults,
  isFilterAppliedSelector,
  selectSearchValueByPage,
  isSearchValueFoundByPage
} from "../../selectors/selector.js";

/**
 * Використовуємо цей хук всередині usePagesNavBarLogic,
 * щоб отримати всі потрібні дані з Redux.
 */
export const usePagesNavBarSelectors = () => {
  const active = useSelector(activeMenu);
  const pagesCount = useSelector(selectPaginationPagesCount(active));

  const isPhonesFound = useSelector(isSearchValueFoundByPage("phones"));
  const isLotusFound = useSelector(isSearchValueFoundByPage("lotus"));
  const isGovUaFound = useSelector(isSearchValueFoundByPage("gov-ua"));

  const foundPhones = useSelector(selectSearchValueByPage("phones"));
  const foundLotus = useSelector(selectSearchValueByPage("lotus"));
  const foundGovUa = useSelector(selectSearchValueByPage("gov-ua"));

  const isFilterApplied = {
    phones: useSelector(state => isFilterAppliedSelector("phones")(state)),
    Lotus: useSelector(state => isFilterAppliedSelector("Lotus")(state)),
    "Gov-ua": useSelector(state => isFilterAppliedSelector("Gov-ua")(state)),
  };

  const countFiltred = {
    phones: useSelector(state => getCountOfPageForFiltredResults(state, "phones")),
    Lotus: useSelector(state => getCountOfPageForFiltredResults(state, "Lotus")),
    "Gov-ua": useSelector(state => getCountOfPageForFiltredResults(state, "Gov-ua")),
  };

  return {
    active,
    pagesCount,
    isPhonesFound,
    isLotusFound,
    isGovUaFound,
    foundPhones,
    foundLotus,
    foundGovUa,
    isFilterApplied,
    countFiltred
  };
};
