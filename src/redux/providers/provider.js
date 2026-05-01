import { useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragContext } from "../contexts/useConetxt";
import { activeMenu, getDataForMenu } from "../selectors/selector";
import { setPagesActionCreator } from "../reducers/data-reducer/data-reducer";
import { changeOrderOfDisplayElements } from "../../dal/api";

const moveItems = (list, ids, toIndex) => {
  const set = new Set(ids);

  const selected = list.filter((item) => set.has(item.id));
  const rest = list.filter((item) => !set.has(item.id));

  return [
    ...rest.slice(0, toIndex),
    ...selected,
    ...rest.slice(toIndex),
  ];
};

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

export const DragProvider = ({ children, rowsPerPage = 18 }) => {
  const [dragIds, setDragIds] = useState([]);      // 🔥 група
  const [selectedIds, setSelectedIds] = useState([]); // 🔥 selection

  const dispatch = useDispatch();
  const menu = useSelector(activeMenu);
  const pages = useSelector((state) => getDataForMenu(state, menu));
  

  const fullData = useMemo(() => {
    return pages?.flatMap((p) => p.rows ?? []) ?? [];
  }, [pages]);

  // 🔥 SELECT
  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }, []);

  // 🔥 DRAG START
  const startDrag = useCallback(
    (id) => {
      if (selectedIds.includes(id)) {
        setDragIds(selectedIds); // група
      } else {
        setDragIds([id]); // одиночний
      }
    },
    [selectedIds]
  );

  const endDrag = useCallback(() => {
    setDragIds([]);
    setSelectedIds([]); // 🔥 очищаємо selection після drop
  }, []);

  // 🔥 DROP
  const handleDrop = useCallback(
    (toIndex, page) => {
      if (!dragIds.length) return;

      const globalToIndex = (page - 1) * rowsPerPage + toIndex;

      const reordered = moveItems(fullData, dragIds, globalToIndex);

      const withPriority = reordered.map((item, index) => ({
        ...item,
        priority: index + 1,
      }));

      const newPages = chunkIntoPages(withPriority, rowsPerPage);
      debugger

      dispatch(setPagesActionCreator(menu, newPages));
      changeOrderOfDisplayElements(withPriority, menu);

      endDrag();
    },
    [dragIds, fullData, rowsPerPage, dispatch, menu, endDrag]
  );

  return (
    <DragContext.Provider
      value={{
        dragIds,
        selectedIds,
        toggleSelect,
        startDrag,
        endDrag,
        handleDrop,
      }}
    >
      {children}
    </DragContext.Provider>
  );
};