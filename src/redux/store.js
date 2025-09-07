import { combineReducers, createStore } from "redux";
import { govuamailsReducer } from "./gov-ua-reduser";


let redusers = combineReducers({
    "govuamailsPage": govuamailsReducer
});

let store = createStore(redusers);

export default store;