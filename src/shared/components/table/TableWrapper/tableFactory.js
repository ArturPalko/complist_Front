import { useDispatch, useSelector } from "react-redux";

import TableWrapper from "./TableWrapper";

import { useRef, useMemo, useCallback, useState } from "react";
import {
  useFoundResults,
  usePageContext,
} from "../../../../redux/contexts/useConetxt";
import { useDragContext } from "../../../../redux/contexts/useConetxt";
import {
  currentPageByMenu,
  isSectionsMode,
  activeMenu,
  getCurrentMode,
  isEditModeSelected,
} from "../../../../redux/selectors/selector";

import { useRedirectHighlight } from "../../../../redux/hooks/useRedirectHighLight";
import { copyToClipboard } from "./subComponents/TableWrapperBody/tableWrapperBody_helpers";


export const createTableComponent = (useTableLogic) => {
  return function TableComponent(props) {
    const dispatch = useDispatch();
    const [hoverCell, setHoverCell] = useState(false);
  const [copiedCellId, setCopiedCellId] = useState(null);

    // =========================
    // REFS
    // =========================
    const headerRef = useRef(null);

    // =========================
    // GLOBAL STATE
    // =========================
    const isSections = useSelector(isSectionsMode);
    const menu = useSelector(activeMenu);
    const currentMode = useSelector(getCurrentMode);
    const editMode = useSelector(isEditModeSelected);

    const page = useSelector((state) =>
      currentPageByMenu(state, menu)
    );

    const {
      foundResults = [],
      indexDataOfFoundResultsForFoundResultsPage = [],
    } = useFoundResults() || {};

    const pageContext = usePageContext();

    // =========================
    // DRAG STATE (NEW LAYER)
    // =========================
    const tableDrag = useDragContext();

    // =========================
    // STABLE MEMO STATE
    // =========================
    const stableFoundResults = useMemo(
      () => foundResults,
      [foundResults]
    );

    const stableIndexData = useMemo(
      () => indexDataOfFoundResultsForFoundResultsPage,
      [indexDataOfFoundResultsForFoundResultsPage]
    );

    const stablePageContext = useMemo(
      () => ({
        titleRef: pageContext?.titleRef,
        columns: pageContext?.columns,
        pageNumber: pageContext?.pageNumber,
        indexesOfFoundResultsForCurrentPage:
          pageContext?.indexesOfFoundResultsForCurrentPage,
      }),
      [
        pageContext?.titleRef,
        pageContext?.columns,
        pageContext?.pageNumber,
        pageContext?.indexesOfFoundResultsForCurrentPage,
      ]
    );

    // =========================
    // HIGHLIGHT LOGIC
    // =========================
    const indexesToUse = useRedirectHighlight({
      pageNumber: stablePageContext.pageNumber,
      defaultIndexes:
        stablePageContext.indexesOfFoundResultsForCurrentPage,
    });

    // =========================
    // CORE TABLE LOGIC
    // =========================
    const baseLogic = useTableLogic({
      headerRef,
      foundResults: stableFoundResults,
      indexesOfFoundResultsForCurrentPage: indexesToUse,
      titleRef: stablePageContext.titleRef,
      columns: stablePageContext.columns,
      pageNumber: stablePageContext.pageNumber,
    });

    // =========================
    // TABLE LOGIC (DATA LAYER)
    // =========================
    const tableLogic = useMemo(
      () => ({
        ...baseLogic,

        headerRef,

        foundResults: stableFoundResults,
        indexDataOfFoundResultsForFoundResultsPage: stableIndexData,
        indexesOfFoundResultsForCurrentPage: indexesToUse,

        shouldRenderIndexesHeader:
          stableIndexData.length > 0,
      }),
      [
        baseLogic,
        stableFoundResults,
        stableIndexData,
        indexesToUse,
      ]
    );

    // =========================
    // TABLE UI (VIEW STATE)
    // =========================
    const tableUI = useMemo(
      () => ({
        dispatch,
        isSections,
        menu,
        currentMode,
        editMode,
        page,
        hoverCell,
        setHoverCell,

        copiedCellId,
        setCopiedCellId,

        copyToClipboard,
      }),
      [dispatch, isSections, menu, currentMode, editMode, page]
    );

    // =========================
    // ROW RENDER WRAPPER
    // =========================
    const renderRowCellsMemo = useCallback(
      (row, index) =>
        props.renderRowCells(row, index, tableLogic, tableUI, tableDrag),
      [props.renderRowCells, tableLogic, tableUI, tableDrag]
    );

    // =========================
    // RENDER
    // =========================
    return (
      <TableWrapper
        tableLogic={tableLogic}
        tableUI={tableUI}
        tableDrag={tableDrag}
        renderHeader={props.renderHeader}
        renderRowCells={renderRowCellsMemo}
      />
    );
  };
};

