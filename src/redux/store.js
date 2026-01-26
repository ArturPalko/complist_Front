import { combineReducers, createStore, applyMiddleware } from "redux";
import {pagesNavbarReducer} from "./pagesNavbar-reducer";
import { thunk } from "redux-thunk";
import { appReducer } from "./app-reducer";
import { toggledElemetsReducer } from "./toggledElements-reducer";
import { filterDataReducer } from "./filterData-reducer";
import { dataReducer } from "./data-reducer";


let reducers = combineReducers({
    "data": dataReducer,           
    "currentPageNumber":pagesNavbarReducer,
    "dataState":appReducer,
    "toggledElements": toggledElemetsReducer,
    "filters": filterDataReducer
    

});
const store = createStore(reducers, applyMiddleware(thunk));

export default store;

window.store = store;