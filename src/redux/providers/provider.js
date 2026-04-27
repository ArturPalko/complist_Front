import { useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragContext } from "../contexts/useConetxt";
import { activeMenu, getDataForMenu } from "../selectors/selector";
import { setPagesActionCreator } from "../reducers/data-reducer/data-reducer";
import { changeOrderOfDisplayElements } from "../../dal/api";

const moveItem = (list, from, to) => {
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
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
  const [dragId, setDragId] = useState(null);
  const [source, setSource] = useState(null);

  const dispatch = useDispatch();
  const menu = useSelector(activeMenu);
  const pages = useSelector((state) => getDataForMenu(state, menu));

  // 🔥 FLAT SOURCE OF TRUTH
  const fullData = useMemo(() => {
    return pages?.flatMap((p) => p.rows ?? []) ?? [];
  }, [pages]);

  const startDrag = useCallback((id, meta = null) => {
    setDragId(id);
    setSource(meta);
  }, []);

  const endDrag = useCallback(() => {
    setDragId(null);
    setSource(null);
  }, []);

  const handleDrop = useCallback(
    (toIndex, page) => {
      if (!dragId) return;

      const fromIndex = fullData.findIndex((x) => x.id === dragId);
      if (fromIndex === -1) return;

      // convert page index → global index
      const globalToIndex = (page - 1) * rowsPerPage + toIndex;

      // 1. reorder
      const reordered = moveItem(fullData, fromIndex, globalToIndex);

      // 2. recalc priority (THIS WAS MISSING BEFORE)
      const withPriority = reordered.map((item, index) => ({
        ...item,
        priority: index + 1,
      }));

      // 3. save for UI (pagination)
      const newPages = chunkIntoPages(withPriority, rowsPerPage);

      dispatch(setPagesActionCreator(menu, newPages));

      // 4. send ONLY FLAT DATA to backend
      changeOrderOfDisplayElements(withPriority, menu);

      endDrag();
    },
    [dragId, fullData, menu, rowsPerPage, dispatch, endDrag]
  );

  return (
    <DragContext.Provider
      value={{
        dragId,
        source,
        startDrag,
        endDrag,
        handleDrop,
      }}
    >
      {children}
    </DragContext.Provider>
  );
};