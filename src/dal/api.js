import axios from "axios";
import axiosRetry from "axios-retry";
import { dictionariesUrl, passwordUrls} from "./urls";
import { changeOrderUrl } from "./urls";
import { positionsUrl } from "./urls";
import { current } from "@reduxjs/toolkit";
import { setDictionaries } from "../redux/reducers/data-reducer/data-reducer";

export const api = axios.create({
  baseURL: "http://localhost:5114", 
  timeout: 10000
});
export const apiPrivate = axios.create({
  baseURL: "http://localhost:5114",
  timeout: 10000,
  withCredentials: true, // критично для отримання cookie
});
// Автоматичні повтори запитів при помилках
axiosRetry(api, {
  retries: 3, // кількість повторів
  retryDelay: (retryCount) => retryCount * 500, 
  retryCondition: (error) => {
    
    return axiosRetry.isNetworkOrIdempotentRequestError(error);
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error("API error:", error.message);
    return Promise.reject(error);
  }
);


export const fetchPasswordsByType = async (type) => {
  const endpoint = passwordUrls[type];
  if (!endpoint) {
    throw new Error(`No password URL defined for menu "${type}"`);
  }

  const { data } = await apiPrivate.get(endpoint);

  return data.reduce((acc, item) => {
    acc[item.id] = item.password;
  
    return acc;
  }, {});
};

export const fetchPasswordById = async (
  type,
  id
) => {
  const endpoint = passwordUrls[type];

  const { data } = await apiPrivate.get(
    `${endpoint}/${id}`
  );

  return data?.password ?? "";
};


export const fetchDictionariesThunk = () => async (dispatch) => {
     
 // dispatch(toggleDataIsFetchingActionCreator(true, "dictionaries"));
////         
  try {
    const { data } = await api.get(dictionariesUrl);
//         
    dispatch(setDictionaries({
      positions: data.positions,
      userTypes: data.userTypes,
      departments: data.departments,
      phones:data.phonesResult,
      users:data.users,
      sections: data.sections,
      deps: data.deps
    }));

   // dispatch(setDataIsLoadedActionCreator(true, "dictionaries"));

  } catch (err) {
    console.error("Dictionaries error:", err.message);
    throw err;

  } finally {
 //   dispatch(toggleDataIsFetchingActionCreator(false, "dictionaries"));
  }
};

export const changeOrderOfDisplayElements = async (
  elements,
  menu,
  depId,
  currentMode
) => {

  const dataToPush = elements.map(el => ({
    id: el.id,
    priority: el.priority
  }));

  const sendUrl = changeOrderUrl(menu);

  // 🔥 phones special case
  if (menu === "phones") {

    const payload = {
      items: dataToPush,
      mode: currentMode,
    };

    if (depId) {
      payload.depId = depId;
    }
         
    return api.post(sendUrl, payload);
  }

  // 🔥 everything else stays SAME AS BEFORE
  return api.post(sendUrl, dataToPush);
};




export const apiAddEntity = (endpoint, payload) => {
           
  return api.post(`/api/${endpoint}`, payload);
};


export const apiEditEntity = (endpoint, { id, ...data }) => {
           
  return api.put(`/api/${endpoint}/${id}`, data);
};



export const apiDeleteEntity = (endpoint, ids) => {
           
  return api.post(`/api/${endpoint}/delete`, ids);
};


export const addUser = (data) =>{
  return api.post('api/addUser', data)
}


export const deleteUser = (ids) =>{
     
  return api.post('api/deleteUsers', ids)
}

export const apiEditUser = ({ id, ...data }) =>{
     
  return api.put(`api/editUser/${id}`, data)
}



export const addMail = (data,menu) =>{
     
  return api.post(`mails/${menu}/addMail`, data)
}

export const deleteMail = (ids) => {
     
  return api.post("mails/deleteMails", ids)
}
export const editMail = ({ id, menu, ...data }) => {
  return api.put(
    `mails/${menu}/editMail/${id}`,
    data
  );
};