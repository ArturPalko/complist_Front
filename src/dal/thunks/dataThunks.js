import {
  toggleDataIsFetchingActionCreator,
  setDataIsLoadedActionCreator
} from "../../redux/reducers/app-reducer";

import { api } from "../api";
import { dataUrls } from "../urls";

import { changeOrderOfDisplayElements } from "../api";

export const fetchDataThunk =
  (actionCreator, menu) =>
  async (dispatch) => {

    const endpoint = dataUrls[menu];
    debugger

    if (!endpoint) {
      throw new Error(`No data URL defined for menu "${menu}"`);
    }
    debugger
    dispatch(toggleDataIsFetchingActionCreator(true, menu));

    try {
      const { data } = await api.get(endpoint);

      // =========================
      // SIMPLE FLOW (RESTORED)
      // =========================
      dispatch(actionCreator(menu, data));
      debugger

      dispatch(setDataIsLoadedActionCreator(true, menu));

    } catch (error) {
      console.error(`Помилка запиту ${menu}:`, error.message);
      throw error;
    } finally {
      dispatch(toggleDataIsFetchingActionCreator(false, menu));
    }
  };


/**
 * Centralized order save + sync logic
 */
export const saveOrder = async ({
  dispatch,
  menu,
  depId,
  currentMode,
  payload,
  getDataByMenu, // thunk for refetch (phones)
}) => {
  try {
    // 🔥 1. save to backend
    await changeOrderOfDisplayElements(
      payload,
      menu,
      depId,
      currentMode
    );
debugger
    // 🔥 2. sync UI for server-driven menus
    if (menu === "phones" && typeof getDataByMenu === "function") {
      debugger
        dispatch(setDataIsLoadedActionCreator(false, menu));
        debugger
    }

    return true;
  } catch (error) {
    console.error("saveOrder failed:", error);
    return false;
  }
};