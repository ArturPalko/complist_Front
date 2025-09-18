
export const createFetchThunk = (fetchUrl, actionCreator) => {
  return async (dispatch) => {
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      dispatch(actionCreator(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};
