
import { getGovUaMails, getLotusMails } from "./selectors/selector";
import { createFetchThunk } from "./fetchDataThunkCreator";


const ADD_MAILS = "ADD_MAILS"
const fetchUrlLotus="http://localhost:5114/mails/Lotus";
const fetchUrlGovUa="http://localhost:5114/mails/Gov-ua";
let fetchUrl = '';

function switchFetchUrl(mailType){
    switch(mailType){
        case "lotus":
            return fetchUrlLotus
        case "gov-ua":
            return fetchUrlGovUa
    }
}

const initialState = {
    lotus:[], ["gov-ua"]:[]
};

export const mailsReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_MAILS  :
             const limitRows = 18;
                let countRows = 0;
                let pageIndex = 1;
                let pages = [];
                let page = { pageIndex, rows: [] };
                function savePage() {
                pages.push(page);
                page = { pageIndex: ++pageIndex, rows: [] };
                countRows = 0;
            }

                for(const mail of action.data){
                    page.rows.push(mail)
                    countRows++
                    if (countRows >= limitRows) savePage();

                }
            return {
                    ...state,
                    [action.mailType]: pages
                };
            default:
                return state;
    }
};

export const addMailsActionCreator = (mailType, data) => ({
    type: ADD_MAILS ,
    mailType,
    data
});

export const getMailsData = (mailType) =>
  createFetchThunk(switchFetchUrl(mailType), addMailsActionCreator,mailType);