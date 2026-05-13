import { useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragContext } from "../../contexts/useConetxt";
import { activeMenu, getDataForMenu, getLastVisitedPage } from "../../selectors/selector";
import { setPagesActionCreator } from "../../reducers/data-reducer/data-reducer";
import { changeOrderOfDisplayElements } from "../../../dal/api";
import { useEffect } from "react";
import { moveItems, chunkIntoPages } from "./dragProvider-helpers/commonFunctions";
import { getGlobalIndex, getDragBounds, isDropInsideSelf } from "./dragProvider-helpers/handleDrop-helpers";
import { getDragGroup, getIndexes, getAnchorIndex, splitBeforeAfter } from "./dragProvider-helpers/startDrag-helpers";
import { getSelectMode, toggleInArray, getRangeSelection } from "./dragProvider-helpers/toggleSelect-helpers";
import { getSelectionSource, getRangeIndexes, buildRangeIds } from "./dragProvider-helpers/selectRange-helpers";
/* =========================
   PROVIDER
========================= */

export const DragProvider = ({ children, rowsPerPage = 18 }) => {
  const [dragIds, setDragIds] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [foundResults, setFoundResults] = useState([]);
  const [dropTargetId, setDropTargetId] = useState(null);

  // 🔥 нова модель range selection (two-point)
  const [rangeStartId, setRangeStartId] = useState(null);

  const [elementsBeforeSelectedIds, setElementsBeforeSelectedIds] = useState([]);
  const [elementsAfterSelectedIds, setElementsAfterSelectedIds] = useState([]);

  const dispatch = useDispatch();

 
  const menu = useSelector(activeMenu);
  const lastPage = useSelector((state) =>
  getLastVisitedPage(state, menu)
);

  const pages = useSelector((state) =>
    menu ? getDataForMenu(state, menu) : []
  ) ?? [];

  /* =========================
     FLAT DATA
  ========================= */

const fullData = useMemo(() => {
  if (!Array.isArray(pages) || pages.length === 0) return [];

  return pages.flatMap((p) =>
    (p?.rows ?? [])
      .filter((el) => el.type === "department") // 👈 ОЦЕ ВАЖЛИВО
      .map((item) => ({
        ...item,
        id:
          item?.id ??
          item?.departmentId ??
          item?.sectionId,
      }))
  );
}, [pages]);
console.log ("fulldata:", fullData)
useEffect(() => {
  const handler = (e) => {
    if (e.key === "Escape") {
    

      setSelectedIds([]);
      setRangeStartId(null);
      setDragIds([]);
    }
  };

  window.addEventListener("keydown", handler);

  return () => window.removeEventListener("keydown", handler);
}, []);


  /* =========================
     RANGE SELECT (2-point)
  ========================= */

const selectRange = useCallback(
  (startId, endId) => {

    const source = getSelectionSource({
      lastPage,
      foundResults,
      fullData,
    });

    if (!source?.length) return;

    const indexes = getRangeIndexes(
      source,
      startId,
      endId
    );

    if (!indexes) return;

    const [from, to] = indexes;

    const range = buildRangeIds(
      source,
      from,
      to
    );

    setSelectedIds(range);
  },
  [lastPage, foundResults, fullData]
);

  /* =========================
     SELECT ROUTER
  ========================= */

const toggleSelect = useCallback((id, e) => {
  const mode = getSelectMode(e);

  if (mode === "RANGE") {
    if (!rangeStartId) {
      setRangeStartId(id);
      return;
    }

    selectRange(rangeStartId, id);
    setRangeStartId(null);
    return;
  }

  if (mode === "TOGGLE") {
    setSelectedIds(prev => toggleInArray(prev, id));
    setRangeStartId(null);
    return;
  }

  setRangeStartId(null);
}, [rangeStartId, selectRange]);

  /* =========================
     DRAG START
  ========================= */

const startDrag = useCallback(
  (id) => {
    if (!fullData.length) return;

    setRangeStartId(null);

    const dragGroup = getDragGroup(id, selectedIds);

    setDragIds(dragGroup);

    const indexes = getIndexes(dragGroup, fullData);
    const anchorIndex = getAnchorIndex(indexes);

    if (anchorIndex === -1) return;

    const { before, after } = splitBeforeAfter(
      fullData,
      anchorIndex
    );

    setElementsBeforeSelectedIds(before);
    setElementsAfterSelectedIds(after);
  },
  [selectedIds, fullData]
);

  /* =========================
     DRAG END
  ========================= */

  const endDrag = useCallback(() => {
    setDragIds([]);
    setSelectedIds([]);
    setRangeStartId(null);
  }, []);

  /* =========================
     DROP
  ========================= */

const handleDrop = useCallback(
  (toIndex, page) => {
    if (!dragIds.length || !fullData.length) return;

    const globalToIndex = getGlobalIndex(
      page,
      toIndex,
      rowsPerPage
    );

    const bounds = getDragBounds(dragIds, fullData);

    if (isDropInsideSelf(globalToIndex, bounds)) {
      endDrag();
      return;
    }

    const reordered = moveItems(
      fullData,
      dragIds,
      globalToIndex
    );

    const withPriority = reordered.map((item, index) => ({
      ...item,
      departmentPriority: index + 1,
    }));

    const newPages = chunkIntoPages(
      withPriority,
      rowsPerPage
    );
  console.log("newPages:", newPages)
  const payload = reordered.map((el, index) => ({
  departmentId: el.departmentId,
  departmentPriority: index + 1,
}));

console.log("DEPARTMENT PRIORITY PAYLOAD:", payload);
  
    dispatch(setPagesActionCreator(menu, payload));
    changeOrderOfDisplayElements(withPriority, menu);

    endDrag();
  },
  [dragIds, fullData, rowsPerPage, menu, endDrag]
);

  /* =========================
     PROVIDER
  ========================= */

  return (
    <DragContext.Provider
      value={{
        dragIds,
        selectedIds,
        setDragIds,
        toggleSelect,
        startDrag,
        endDrag,
        handleDrop,
        elementsBeforeSelectedIds,
        elementsAfterSelectedIds,
        fullData,
        rangeStartId,
        endDrag,
        setFoundResults,
        isOnFoundResultsPage: lastPage == "foundResults",
        dropTargetId,
        setDropTargetId,
        
      }}
    >
      {children}
    </DragContext.Provider>
  );
};



