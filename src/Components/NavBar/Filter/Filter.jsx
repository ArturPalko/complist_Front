import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FilterPanel from "../FilterPanel/FilterPanel";
import { isPresentedFielterPanel } from "../../../redux/selectors/selector";
import { toggleFielterPanelElement } from "../../../redux/toggledElements-reducer";
import { clearFiltredData } from "../../../redux/selectors/filterData-reducer";

const Filter = () => {
  const dispatch = useDispatch();
  const isFilterPanelVisibleFromStore = useSelector(isPresentedFielterPanel);

  // Локальний стейт відкриття/закриття
  const [isOpen, setIsOpen] = useState(isFilterPanelVisibleFromStore);

  // Синхронізація локального стейту з Redux
  useEffect(() => {
    setIsOpen(isFilterPanelVisibleFromStore);
  }, [isFilterPanelVisibleFromStore]);

  const togglePanel = () => {
    setIsOpen(prev => !prev);
    dispatch(toggleFielterPanelElement(!isOpen));
  };

  return (
    <div style={{ gridArea: "f", position: "relative" }}>
        
  {/* тут твоя стрілка та панель */}

        
      {/* Стрілка */}
    <span
  onClick={()=>{togglePanel(); dispatch(clearFiltredData())}}
  style={{
    position: "absolute",
    left: "10px",
    top: "15px",
    transform: "translateY(-50%)",
    cursor: "pointer",
    zIndex: 1000,
    background: "white",
    color: "black", // <-- ось тут явно чорний текст
    padding: "2px 6px",
    borderRadius: "4px",
    boxShadow: "0 0 3px rgba(0,0,0,0.3)",
  }}
>
  {isOpen ? "◀" : "▶"}
</span>



      {/* Панель */}
      <div
        style={{
          position: "absolute",
          left: 0,
       
          width: "100%",
          transition: "transform 0.3s ease, opacity 0.3s ease",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
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
