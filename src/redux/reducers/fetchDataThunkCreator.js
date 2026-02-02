import { toggleDataIsFetchingActionCreator } from "./app-reducer";
import {setDataIsLoadedActionCreator} from "./app-reducer";
import { api } from "../../dal/api";

export const createFetchThunk = (endpoint, actionCreator, menu) => async (dispatch) => {
  dispatch(toggleDataIsFetchingActionCreator(true, menu));

  try {
  
    const { data } = await api.get(endpoint);
    dispatch(actionCreator(menu, data));
    dispatch(setDataIsLoadedActionCreator(true, menu));
  } catch (error) {
    console.error(`Помилка запиту ${menu}:`, error.message);
    throw error;
  } finally {
    dispatch(toggleDataIsFetchingActionCreator(false, menu));
  }
};
