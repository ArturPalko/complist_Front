import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FilterPanel from "../FilterPanel/FilterPanel";
import { activeMenu, isPresentedFielterPanel, GovUaCurrentPage, lotusCurrentPage, phonesCurrentPage } from "../../../redux/selectors/selector";
import { toggleFielterPanelElement } from "../../../redux/toggledElements-reducer";
import { clearFiltredData } from "../../../redux/selectors/filterData-reducer";
import { redirectToPage } from "../commonFunctions";

const Filter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentMenu = useSelector(activeMenu);
  const isFilterPanelVisibleFromStore = useSelector(isPresentedFielterPanel);
  const govUaPage = useSelector(GovUaCurrentPage);
  const lotusPage = useSelector(lotusCurrentPage);
  const phonesPage = useSelector(phonesCurrentPage);

  const [isOpen, setIsOpen] = useState(isFilterPanelVisibleFromStore);

  useEffect(() => {
    setIsOpen(isFilterPanelVisibleFromStore);
  }, [isFilterPanelVisibleFromStore]);

  const togglePanel = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    dispatch(toggleFielterPanelElement(newState));
    dispatch(clearFiltredData());

    // Якщо панель закривається — редірект на актуальну сторінку
    if (!newState) {
      redirectToPage({
        navigate,
        activeMenu: currentMenu,
        GovUaCurrentPage: govUaPage,
        lotusCurrentPage: lotusPage,
        phonesCurrentPage: phonesPage
      });
    }
  };

  return (
    <div style={{ gridArea: "f", position: "relative" }}>
      <span
        onClick={togglePanel}
        style={{
          position: "absolute",
          top: "15px",
          transform: "translateY(-50%)",
          cursor: "pointer",
          zIndex: 1000,
          background: "white",
          color: "black",
          padding: "2px 6px",
          borderRadius: "4px",
          boxShadow: "0 0 3px rgba(0,0,0,0.3)",
        }}
      >
        {isOpen ? "◀" : "▶"}
      </span>

      <div
        style={{
          position: "absolute",
          left: 0,
          width: "100%",
          opacity: isOpen ? 1 : 0,
          zIndex: 100,
        }}
      >
        <FilterPanel />
      </div>
    </div>
  );
};

export default Filter;
