import { useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragContext } from "../contexts/useConetxt";
import { activeMenu, getDataForMenu, getLastVisitedPage } from "../selectors/selector";
import { setPagesActionCreator } from "../reducers/data-reducer/data-reducer";
import { changeOrderOfDisplayElements } from "../../dal/api";
import { useEffect } from "react";

/* =========================
   MOVE LOGIC
========================= */

const moveItems = (list, ids, toIndex) => {
  const set = new Set(ids);

  const selected = [];
  const rest = [];

  let firstIndex = -1;

  list.forEach((item, idx) => {
    if (set.has(item.id)) {
      selected.push(item);
      if (firstIndex === -1) firstIndex = idx;
    } else {
      rest.push(item);
    }
  });

  if (selected.length === 0) return list;

  const movingDown = toIndex > firstIndex;

  const shift = selected.length;

  const baseIndex = movingDown
    ? toIndex - shift
    : toIndex + 1;

  const safeIndex = Math.max(
    0,
    Math.min(baseIndex, rest.length)
  );

  return [
    ...rest.slice(0, safeIndex),
    ...selected,
    ...rest.slice(safeIndex),
  ];
};

/* =========================
   PAGINATION
========================= */

const chunkIntoPages = (list, size) => {
  const pages = [];

  for (let i = 0; i < list.length; i += size) {
    pages.push({
      pageIndex: pages.length + 1,
      rows: list.slice(i, i + size),
    });
  }

  return pages;
};

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



useEffect(() => {
  const handler = (e) => {
    console.log("KEY:", e.key); // 👈 перевірка

    if (e.key === "Escape") {
      console.log("ESC PRESSED");

      setSelectedIds([]);
      setRangeStartId(null);
      setDragIds([]);
    }
  };

  window.addEventListener("keydown", handler);

  return () => window.removeEventListener("keydown", handler);
}, []);

  /* =========================
     FLAT DATA
  ========================= */

  const fullData = useMemo(() => {
    if (!Array.isArray(pages) || pages.length === 0) return [];
    return pages.flatMap((p) => p?.rows ?? []);
  }, [pages]);

  /* =========================
     RANGE SELECT (2-point)
  ========================= */

const selectRange = useCallback(
  (startId, endId) => {
    const source =
      lastPage === "foundResults"
        ? foundResults
        : fullData;

    if (!source || source.length === 0) return;

    const start = source.findIndex(i => i.id === startId);
    const end = source.findIndex(i => i.id === endId);

    if (start === -1 || end === -1) return;

    const [from, to] =
      start < end ? [start, end] : [end, start];

    const range = source
      .slice(from, to + 1)
      .map(i => i.id);

    setSelectedIds(range);

    console.log("Source:", activeMenu === "foundResults" ? "foundResults" : "fullData");
    console.log("Range:", range);
  },
  [fullData, foundResults, activeMenu]
);

  /* =========================
     SELECT ROUTER
  ========================= */

  const toggleSelect = useCallback((id, e) => {
    // 🔹 ALT → two-step range selection
    if (e?.altKey) {
      // 1st click → set start
      if (!rangeStartId) {
        setRangeStartId(id);
        return;
      }

      // 2nd click → complete range
      selectRange(rangeStartId, id);
      setRangeStartId(null);
      return;
    }

    // 🔹 CTRL → multi toggle
    if (e?.ctrlKey) {
      setSelectedIds((prev) =>
        prev.includes(id)
          ? prev.filter(x => x !== id)
          : [...prev, id]
      );

      setRangeStartId(null);
      return;
    }

    // reset range if normal interaction happens
    setRangeStartId(null);
  }, [rangeStartId, selectRange]);

  /* =========================
     DRAG START
  ========================= */

  const startDrag = useCallback(
    (id) => {
      if (!fullData.length) return;

      setRangeStartId(null);

      const isGroupDrag = selectedIds.includes(id);
      const dragGroup = isGroupDrag ? selectedIds : [id];

      setDragIds(dragGroup);

      const indexes = dragGroup
        .map(id => fullData.findIndex(i => i.id === id))
        .filter(i => i !== -1);

      if (!indexes.length) return;

      const anchorIndex = Math.min(...indexes);

      setElementsBeforeSelectedIds(
        fullData.slice(0, anchorIndex).map(i => i.id)
      );

      setElementsAfterSelectedIds(
        fullData.slice(anchorIndex + 1).map(i => i.id)
      );
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

      const globalToIndex = (page - 1) * rowsPerPage + toIndex;

      const reordered = moveItems(fullData, dragIds, globalToIndex);

      const withPriority = reordered.map((item, index) => ({
        ...item,
        priority: index + 1,
      }));

      const newPages = chunkIntoPages(withPriority, rowsPerPage);

      dispatch(setPagesActionCreator(menu, newPages));
      changeOrderOfDisplayElements(withPriority, menu);

     endDrag();
    },
    [dragIds, fullData, rowsPerPage, dispatch, menu, endDrag]
  );

  /* =========================
     PROVIDER
  ========================= */
console.log ("selectedIDS:", selectedIds)
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
        setDropTargetId
      }}
    >
      {children}
    </DragContext.Provider>
  );
};



