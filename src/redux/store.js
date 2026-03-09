import { combineReducers, createStore, applyMiddleware } from "redux";
import {pagesNavbarReducer} from "./reducers/pagesNavbar-reducer";
import { thunk } from "redux-thunk";
import { appReducer } from "./reducers/app-reducer";
import { toggledElemetsReducer } from "./reducers/toggledElements-reducer";
import { filterDataReducer } from "./reducers/filterData-reducer";
import { dataReducer } from "./reducers/data-reducer/data-reducer";
import { authReducer } from "./reducers/auth-reducer";
import uiReducer from "./reducers/ui-reducer";


let reducers = combineReducers({
    "ui":uiReducer,
    "auth":authReducer,
    "data": dataReducer,           
    "currentPageNumber":pagesNavbarReducer,
    "dataState":appReducer,
    "toggledElements": toggledElemetsReducer,
    "filters": filterDataReducer
    

});
const store = createStore(reducers, applyMiddleware(thunk));

export default store;

window.store = store;