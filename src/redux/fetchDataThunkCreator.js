import { toggleDataIsFetchingActionCreator } from "./app-reducer";
import {setDataIsLoadedActionCreator} from "./app-reducer";

export const createFetchThunk = (fetchUrl, actionCreator, type) => {
  return async (dispatch) => {
    dispatch(toggleDataIsFetchingActionCreator(true, type));

    const startTime = Date.now();
    const timeout = 10000; 
    let data = null;
    let success = false;

    while (Date.now() - startTime < timeout && !success) {
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        data = await response.json();
        
        success = true; 
        break;
      } catch (error) {
        await new Promise(res => setTimeout(res, 500));
      }
    }

    dispatch(toggleDataIsFetchingActionCreator(false, type));

    if (success) {
      if (type !== "phones") {
        dispatch(actionCreator(type, data));
      } else {
        dispatch(actionCreator(data));
      }
      dispatch(setDataIsLoadedActionCreator(true, type));
    
    }
    if (!success) {
      throw new Error("Перевищено час очікування даних від сервера");
}

  };
};
