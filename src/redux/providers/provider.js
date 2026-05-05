import { useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragContext } from "../contexts/useConetxt";
import { activeMenu, getDataForMenu } from "../selectors/selector";
import { setPagesActionCreator } from "../reducers/data-reducer/data-reducer";
import { changeOrderOfDisplayElements } from "../../dal/api";

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

  const movingDown = toIndex > firstIndex;

  const shift = selected.length - 1;

  const safeIndex = Math.max(
    0,
    Math.min(
      movingDown ? toIndex - shift : toIndex,
      rest.length
    )
  );

  return [
    ...rest.slice(0, safeIndex),
    ...selected,
    ...rest.slice(safeIndex),
  ];
};
// const moveItems = (list, ids, toIndex) => {
//   const set = new Set(ids);

//   const selected = [];
//   const rest = [];

//   list.forEach(item => {
//     if (set.has(item.id)) selected.push(item);
//     else rest.push(item);
//   });

//   const fromIndex = list.findIndex(item => set.has(item.id));

//   // 🔥 різна логіка для напрямку
//   const safeIndex =
//     toIndex > fromIndex
//       // вниз → зсув
//       ? toIndex - (selected.length - 1)
//       // вверх → без змін
//       : toIndex;

//   const clamped = Math.max(0, Math.min(safeIndex, rest.length));

//   return [
//     ...rest.slice(0, clamped),
//     ...selected,
//     ...rest.slice(clamped),
//   ];
// };



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

  const [elementsBeforeSelectedIds, setElementsBeforeSelectedIds] = useState([]);
  const [elementsAfterSelectedIds, setElementsAfterSelectedIds] = useState([]);
  

  const dispatch = useDispatch();

  const menu = useSelector(activeMenu);

  const pages = useSelector((state) =>
    menu ? getDataForMenu(state, menu) : []
  ) ?? [];

  /* =========================
     LOGS
  ========================= */
  // console.log("PAGEEESS:", pages);

  /* =========================
     FLAT DATA (SAFE)
  ========================= */
  const fullData = useMemo(() => {
    if (!Array.isArray(pages) || pages.length === 0) return [];

    return pages.flatMap((p) => p?.rows ?? []);
  }, [pages]);

  // console.log("FUUULL DATA:", fullData);

  /* =========================
     SELECT
  ========================= */
  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }, []);

  /* =========================
     DRAG START
  ========================= */
const startDrag = useCallback(
  (id) => {
    if (!fullData.length) return;

    const isGroupDrag = selectedIds.includes(id);
    const dragGroup = isGroupDrag ? selectedIds : [id];

    setDragIds(dragGroup);

    const indexes = dragGroup
      .map(id => fullData.findIndex(i => i.id === id))
      .filter(i => i !== -1);

    if (!indexes.length) return;

    const anchorIndex = Math.min(...indexes);

    const before = fullData
      .slice(0, anchorIndex)
      .map(i => i.id);

    const after = fullData
      .slice(anchorIndex + 1)
      .map(i => i.id);

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

      console.log("NEW PAGES:", newPages);

      dispatch(setPagesActionCreator(menu, newPages));
      changeOrderOfDisplayElements(withPriority, menu);

      endDrag();
    },
    [dragIds, fullData, rowsPerPage, dispatch, menu, endDrag]
  );

  /* =========================
     PROVIDE CONTEXT
  ========================= */
  return (
    <DragContext.Provider
      value={{
        dragIds,
        selectedIds,
        toggleSelect,
        startDrag,
        endDrag,
        handleDrop,
        elementsBeforeSelectedIds,
        elementsAfterSelectedIds,
        fullData,
      }}
    >
      {children}
    </DragContext.Provider>
  );
};