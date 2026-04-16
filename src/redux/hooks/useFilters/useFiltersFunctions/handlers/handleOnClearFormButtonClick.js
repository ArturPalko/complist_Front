import { clearCurrentForm,addIndexesOfFiltredResults } from "../../../../reducers/filter-data-reducer/filterData-reducer";

export const clearFormHelper = ({ activeMenu, dispatch }) => {

  dispatch(clearCurrentForm(activeMenu));
  // обнуляємо індекси відфільтрованих результатів
  //dispatch(addIndexesOfFiltredResults(activeMenu, []));
};