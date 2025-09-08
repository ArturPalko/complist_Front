import { combineReducers, createStore } from "redux";
import { govuamailsReducer } from "./gov-ua-reduser";
import { lotusmailsReducer } from "./lotus-reduser";


let redusers = combineReducers({
    "govuamailsPage": govuamailsReducer
    "lotusmailsPage": lotusmailsPageReducer
});

let store = createStore(redusers);

export default store;