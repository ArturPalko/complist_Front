import {toggleDataIsFetchingActionCreator, setDataIsLoadedActionCreator} from "../redux/reducers/app-reducer"
import { api } from "./api";
import { dataUrls } from "./urls";

/**
 * ============================
 * THUNK ДЛЯ DATA (Phones, Lotus, Gov-ua)
 * ============================
 * @param {function} actionCreator - Redux action creator для збереження даних
 * @param {string} menu - ключ сторінки (Pages.PHONES, Pages.LOTUS, Pages.GOV_UA)
 */
export const fetchDataThunk = (actionCreator, menu) => async (dispatch) => {
  const endpoint = dataUrls[menu];
  if (!endpoint) throw new Error(`No data URL defined for menu "${menu}"`);

  dispatch(toggleDataIsFetchingActionCreator(true, menu));

  try {
    const { data } = await api.get(endpoint); // запит через централізований axios
    dispatch(actionCreator(menu, data));      // збереження даних у Redux
    dispatch(setDataIsLoadedActionCreator(true, menu));
  } catch (error) {
    console.error(`Помилка запиту ${menu}:`, error.message);
    throw error;
  } finally {
    dispatch(toggleDataIsFetchingActionCreator(false, menu));
  }
};

