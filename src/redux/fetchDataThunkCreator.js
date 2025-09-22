import { toggleDataIsFetchingActionCreator } from "./app-reducer";
import {setDataIsLoadedActionCreator} from "./app-reducer";

export const createFetchThunk = (fetchUrl, actionCreator,type) => {
  return async (dispatch) => {
    try {
      dispatch(toggleDataIsFetchingActionCreator(true,type));
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      dispatch(toggleDataIsFetchingActionCreator(false,type));
      if(type!="phones"){
        dispatch(actionCreator(type,data));
      }
      else{
           dispatch(actionCreator(data));
      }
      dispatch(setDataIsLoadedActionCreator(true,type))
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};
