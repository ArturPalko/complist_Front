import { combineReducers, createStore } from "redux";
import { mailsReducer } from "./mails-reducer";
import { phonesReducer } from "./phones-reducer";


let redusers = combineReducers({
    "mails": mailsReducer,
    "phones": phonesReducer

});

let store = createStore(redusers);

export default store;