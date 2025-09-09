import { combineReducers, createStore } from "redux";
import { mailsReducer } from "./mails-reducer";


let redusers = combineReducers({
    "mails": mailsReducer,

});

let store = createStore(redusers);

export default store;