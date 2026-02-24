import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import FilterPanel from "../FilterPanel/FilterPanelContainer";
import {
  activeMenu,
  isPresentedFielterPanel,
  currentPageByMenu
} from "../../../redux/selectors/selector";

import { toggleFielterPanelElement } from "../../../redux/reducers/toggledElements-reducer";
import { clearFiltredData } from "../../../redux/reducers/filterData-reducer";
import { redirectToPage } from "../commonFunctions";

import s from "./Filter.module.css"; // файл стилів

const Filter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentMenu = useSelector(activeMenu);
  const isFilterPanelVisibleFromStore = useSelector(isPresentedFielterPanel);
  const currentPage = useSelector((state) =>
    currentPageByMenu(state, currentMenu)
  );

  const [isOpen, setIsOpen] = useState(isFilterPanelVisibleFromStore);

  useEffect(() => {
    setIsOpen(isFilterPanelVisibleFromStore);
  }, [isFilterPanelVisibleFromStore]);

  const togglePanel = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    dispatch(toggleFielterPanelElement(newState));
    dispatch(clearFiltredData());

    if (!newState) {
      redirectToPage({
        navigate,
        activeMenu: currentMenu,
        currentPage
      });
    }
  };

  return (
    <div className={s.filterWrapper}>
      <span
        onClick={togglePanel}
        className={s.toggleButton}
      >
        {isOpen ? "◀" : "▶"}
      </span>

      <div className={`${s.panelContainer} ${isOpen ? s.open : s.closed}`}>
        <FilterPanel />
      </div>
    </div>
  );
};

export default Filter;
