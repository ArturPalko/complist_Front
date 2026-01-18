import { createFetchThunk } from "./fetchDataThunkCreator";
import { rowsPerPage as limitRows } from "./selectors/selector";
import { paginateData } from "../redux/reducersHelpunctions/pagination.js"; // імпортуємо винесену функцію пагінації

const ADD_MAILS = "ADD_MAILS";

const fetchUrlLotus = "http://localhost:5114/mails/Lotus";
const fetchUrlGovUa = "http://localhost:5114/mails/Gov-ua";

function switchFetchUrl(mailType) {
  switch (mailType) {
    case "Lotus":
      return fetchUrlLotus;
    case "Gov-ua":
      return fetchUrlGovUa;
    default:
      return "";
  }
}

const initialState = {
  Lotus: [],
  "Gov-ua": []
};

// ====================== reducer ======================
export const mailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MAILS: {
      const { mailType, data } = action;

      return {
        ...state,
        [mailType]: paginateData(data, mailType, limitRows)
      };
    }
    default:
      return state;
  }
};

// ====================== action creator ======================
export const addMailsActionCreator = (mailType, data) => ({
  type: ADD_MAILS,
  mailType,
  data
});

// ====================== thunk ======================
export const getMailsData = (mailType) =>
  createFetchThunk(switchFetchUrl(mailType), addMailsActionCreator, mailType);
