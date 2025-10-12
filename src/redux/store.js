import { combineReducers, createStore, applyMiddleware } from "redux";
import { mailsReducer } from "./mails-reducer";
import { phonesReducer } from "./phones-reducer";
import {pagesNavbarReducer} from "./pagesNavbar-reducer";
import { thunk } from "redux-thunk";
import { appReducer } from "./app-reducer";
import { toggledElemetsReducer } from "./toggledElements-reducer";


let reducers = combineReducers({
    "mails": mailsReducer,
    "phones": phonesReducer,
    "currentPageNumber":pagesNavbarReducer,
    "dataState":appReducer,
    "toggledElements": toggledElemetsReducer,
    

});
const store = createStore(reducers, applyMiddleware(thunk));

export default store;

window.store = store;