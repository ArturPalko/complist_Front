import { clearCurrentForm, addIndexesOfFiltredResults } from "../../../../reducers/filterData-reducer";
export const clearFormHelper = ({ activeMenu, dispatch }) => {

  dispatch(clearCurrentForm(activeMenu));
  // обнуляємо індекси відфільтрованих результатів
  //dispatch(addIndexesOfFiltredResults(activeMenu, []));
};