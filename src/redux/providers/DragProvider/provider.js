import {
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

import { useSelector, useDispatch } from "react-redux";

import { DragContext } from "../../contexts/useConetxt";
import { getDataByMenu } from "../../reducers/data-reducer/data-reducer";

import { setUnsavedOrder } from "../../reducers/ui-reducer";
import {
  activeMenu,
  getCurrentMode,
  getDataForMenu,
  getLastVisitedPage,
  selectAtiveDepartmentId,
} from "../../selectors/selector";

import { setPagesActionCreator } from "../../reducers/data-reducer/data-reducer";

import { saveOrder } from "../../../dal/thunks/dataThunks";

import { moveItems } from "./dragProvider-helpers/commonFunctions";

import {
  getGlobalIndex,
  getDragBounds,
  isDropInsideSelf,
} from "./dragProvider-helpers/handleDrop-helpers";

import {
  getDragGroup,
  getIndexes,
  getAnchorIndex,
  splitBeforeAfter,
} from "./dragProvider-helpers/startDrag-helpers";

import {
  getSelectMode,
  toggleInArray,
} from "./dragProvider-helpers/toggleSelect-helpers";

import {
  getSelectionSource,
  getRangeIndexes,
  buildRangeIds,
} from "./dragProvider-helpers/selectRange-helpers";
import { changeOrderOfDisplayElements } from "../../../dal/api";

/* =========================
   PROVIDER
========================= */

export const DragProvider = ({ children, rowsPerPage = 18 }) => {
  const [dragIds, setDragIds] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [foundResults, setFoundResults] = useState([]);
  const [dropTargetId, setDropTargetId] = useState(null);
  const [rangeStartId, setRangeStartId] = useState(null);

  const depId = useSelector(selectAtiveDepartmentId);

  const [elementsBeforeSelectedIds, setElementsBeforeSelectedIds] = useState([]);
  const [elementsAfterSelectedIds, setElementsAfterSelectedIds] = useState([]);

  const dispatch = useDispatch();

  const menu = useSelector(activeMenu);
  const currentMode = useSelector(getCurrentMode);

  const lastPage = useSelector((state) =>
    getLastVisitedPage(state, menu)
  );

  const pages =
    useSelector((state) =>
      menu ? getDataForMenu(state, menu) : []
    ) ?? [];

  /* =========================
     FLAT DATA
  ========================= */

  const fullData = useMemo(() => {
    if (!Array.isArray(pages) || pages.length === 0) {
      return [];
    }

    const rows = pages.flatMap((p) => p?.rows ?? []);

    if (menu === "phones") {
      return rows
        .filter(
          (el) =>
            el?.type === "department" ||
            el?.type === "section" ||
            el?.type === "position" ||
            el?.type === "userType"
        )
        .map((item) => ({
          ...item,
          id:
            item.type === "department"
              ? item.departmentId
              : item.type === "section"
              ? item.sectionId
              : item.id,
        }))
        .filter((el) => el.id != null);
    }

    return rows.map((item) => ({
      ...item,
      id: item?.id ?? item?.mailId ?? item?.sectionId,
    }));
  }, [pages, menu]);

  /* =========================
     ESC RESET
  ========================= */

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
     RANGE SELECT
  ========================= */

  const selectRange = useCallback(
    (startId, endId) => {
      const source = getSelectionSource({
        lastPage,
        foundResults,
        fullData,
      });

      if (!source?.length) return;

      const indexes = getRangeIndexes(source, startId, endId);
      if (!indexes) return;

      const [from, to] = indexes;
      const range = buildRangeIds(source, from, to);

      setSelectedIds(range);
    },
    [lastPage, foundResults, fullData]
  );

  /* =========================
     SELECT
  ========================= */

  const toggleSelect = useCallback(
    (id, e) => {
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
        setSelectedIds((prev) => toggleInArray(prev, id));
        setRangeStartId(null);
        return;
      }

      setRangeStartId(null);
    },
    [rangeStartId, selectRange]
  );

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

      const { before, after } = splitBeforeAfter(fullData, anchorIndex);

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
     SAVE ORDER (CENTRAL LOGIC)
  ========================= */

  const runSaveOrder = useCallback(
    (payload) => {
      return saveOrder({
        dispatch,
        menu,
        depId,
        currentMode,
        payload,
        getDataByMenu
      });
    },
    [dispatch, menu, depId, currentMode]
  );

  /* =========================
     DROP
  ========================= */

const handleDrop = useCallback(
  (toIndex, page) => {
    debugger
    if (!dragIds.length || !fullData.length) return;
debugger
    // 🔥 SWAP CASE
    if (fullData.length === 2) {
      const reordered = [fullData[1], fullData[0]];

      const payload = reordered.map((el, index) => ({
        id: el.sectionId ?? el.departmentId ?? el.id,
        priority: index + 1,
      }));
debugger
      dispatch(
        setPagesActionCreator(
          menu,
          menu === "phones" ? payload : reordered,
          depId,
          currentMode
        )
      );

      debugger

      // 🔥 SAVE SNAPSHOT (NO API HERE)
      dispatch(
        setUnsavedOrder({
          menu,
          currentMode,
          depId,
          payload,
        })
      );

      endDrag();
      return;
    }

    // 🔥 NORMAL FLOW
    const globalToIndex = getGlobalIndex(page, toIndex, rowsPerPage);

    const bounds = getDragBounds(dragIds, fullData);

    if (isDropInsideSelf(globalToIndex, bounds)) {
      endDrag();
      return;
    }

    const reordered = moveItems(fullData, dragIds, globalToIndex);

    const payload = reordered.map((el, index) => ({
      id: el.sectionId ?? el.departmentId ?? el.id,
      priority: index + 1,
    }));
debugger
    dispatch(
      setPagesActionCreator(
        menu,
        {
          reordered,
          payload,
        },
        depId,
        currentMode
      )
    );
debugger
    // 🔥 SAVE SNAPSHOT (NO API HERE)
    dispatch(
      setUnsavedOrder({
        menu,
        currentMode,
        depId,
        payload,
      })
    );
debugger
    endDrag();
  },
  [
    dragIds,
    fullData,
    rowsPerPage,
    menu,
    depId,
    currentMode,
    dispatch,
    endDrag,
  ]
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
        setFoundResults,
        isOnFoundResultsPage: lastPage === "foundResults",
        dropTargetId,
        setDropTargetId,
      }}
    >
      {children}
    </DragContext.Provider>
  );
};


