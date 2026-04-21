import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { pageConfigs } from "../../../../configs/app/pageConfig";
import { addIndexesFromIndexCell } from "../../../../redux/reducers/toggledElements-reducer";
import { useDispatch, useSelector } from "react-redux";
import { activeMenu, selectSearchStateByMenu } from "../../../../redux/selectors/selector";
import { getIndexesForSection } from "./helpers";

export const useIndexCellLogic = (
  index,
  indexData,
  pageName,
  isNonUserRowType,
  isSetionType
) => {
  const [hoveredRow, setHoveredRow] = useState(false);
  const [clickedRow, setClickedRow] = useState(false);

  const rowRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cellData = indexData?.[index];

  const menu = useSelector(activeMenu);
  const searchState = useSelector((state) =>
    selectSearchStateByMenu(state, menu)
  );

const foundResults = searchState.foundResults ?? [];




  const handleMouseEnter = useCallback(() => setHoveredRow(true), []);
  const handleMouseLeave = useCallback(() => setHoveredRow(false), []);

  const handleClick = useCallback(() => {
    if (!cellData) return;

    const targetPage = cellData.currentPage;
    const config = pageConfigs[pageName];
    const url = config ? `${config.basePath}${targetPage}` : "/";

    setClickedRow(true);
  
    if (isSetionType) {
      const currentIndex = foundResults.findIndex(
        (item) => item.index === cellData.index && item.currentPage == targetPage
      );
      debugger
      
      if (currentIndex !== -1) {
        const indexes = getIndexesForSection(foundResults, currentIndex,targetPage);
        debugger
        
        dispatch(addIndexesFromIndexCell(indexes));
      }
    } else if (!isNonUserRowType) {
      dispatch(addIndexesFromIndexCell([cellData.index]));
    }

    setTimeout(() => navigate(url), 300);
  }, [
    cellData,
    pageName,
    navigate,
    dispatch,
    foundResults,
    isSetionType,
    isNonUserRowType,
  ]);

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