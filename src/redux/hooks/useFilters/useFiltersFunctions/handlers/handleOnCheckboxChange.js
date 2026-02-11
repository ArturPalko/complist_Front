import { addFilter, setSubFilters } from "../../../../reducers/filterData-reducer";

export const handleCheckboxChangeHelper = ({ activeMenu, key, category, dispatch, allValues, checked = null }) => {
  if (activeMenu === "phones" && category) {
    // Сабфільтри для phones
    // allValues: масив всіх можливих значень для toggle all або одиночного елемента
    // checked: null => toggle одиночний, true/false => explicit set (toggle all)
    dispatch(setSubFilters("phones", category, [key], checked));
  } else {
    // Звичайний фільтр
    dispatch(addFilter(activeMenu, key));
  }
};
