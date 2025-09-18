import { combineReducers, createStore, applyMiddleware } from "redux";
import { mailsReducer } from "./mails-reducer";
import { phonesReducer } from "./phones-reducer";
import { thunk } from "redux-thunk";



let reducers = combineReducers({
    "mails": mailsReducer,
    "phones": phonesReducer
    

});
const store = createStore(reducers, applyMiddleware(thunk));

export default store;

window.store = store;