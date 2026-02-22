import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { pageConfigs } from "../../../../../configs/app/pageConfig";

export const useIndexCellLogic = (index, indexData, pageName) => {
  const [hoveredRow, setHoveredRow] = useState(false);
  const [clickedRow, setClickedRow] = useState(false);

  const rowRef = useRef(null);
  const navigate = useNavigate();

  const cellData = indexData?.[index];

  const handleMouseEnter = useCallback(() => setHoveredRow(true), []);
  const handleMouseLeave = useCallback(() => setHoveredRow(false), []);

  const handleClick = useCallback(() => {
    if (!cellData) return;

    const targetPage = cellData.currentPage;
  const config = pageConfigs[pageName];
  const url = config ? `${config.basePath}${targetPage}` : "/"; 
    setClickedRow(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => navigate(url), 300);
      });
    });
  }, [cellData, pageName, navigate]);

  return {
    cellData,
    hoveredRow,
    clickedRow,
    rowRef,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
  };
};
