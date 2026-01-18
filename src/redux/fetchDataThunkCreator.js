import { toggleDataIsFetchingActionCreator } from "./app-reducer";
import {setDataIsLoadedActionCreator} from "./app-reducer";

export const createFetchThunk = (fetchUrl, actionCreator, menu) => {
  return async (dispatch) => {
    dispatch(toggleDataIsFetchingActionCreator(true, menu));

    const startTime = Date.now();
    const timeout = 10000;
    let success = false;
    let data = null;

    while (Date.now() - startTime < timeout && !success) {
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error();

        data = await response.json();
        success = true;
      } catch {
        await new Promise(res => setTimeout(res, 500));
      }
    }

    dispatch(toggleDataIsFetchingActionCreator(false, menu));

    if (!success) {
      throw new Error("Перевищено час очікування даних від сервера");
    }

    dispatch(actionCreator(menu, data));
    dispatch(setDataIsLoadedActionCreator(true, menu));
  };
};

