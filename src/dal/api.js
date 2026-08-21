import axios from "axios";
import axiosRetry from "axios-retry";
import { dictionariesUrl, passwordUrls, changeOrderUrl } from "./urls";
import { setDictionaries } from "../redux/reducers/data-reducer/data-reducer";

export const api = axios.create({
  baseURL: "http://localhost:5114",
  timeout: 40000
});

export const apiPrivate = axios.create({
  baseURL: "http://localhost:5114",
  timeout: 40000,
  withCredentials: true
});

axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 500,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error);
  }
});

axiosRetry(apiPrivate, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 500,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error);
  }
});

api.interceptors.response.use(
  response => response,
  err => {
    console.error("URL:", err.config?.url);
    console.error("METHOD:", err.config?.method);
    console.error("STATUS:", err.response?.status);

    return Promise.reject(err);
  }
);

apiPrivate.interceptors.response.use(
  response => response,
  err => {
    console.error("PRIVATE API URL:", err.config?.url);
    console.error("PRIVATE API METHOD:", err.config?.method);
    console.error("PRIVATE API STATUS:", err.response?.status);

    return Promise.reject(err);
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

export const fetchPasswordById = async (type, id) => {
  const endpoint = passwordUrls[type];

  const { data } = await apiPrivate.get(`${endpoint}/${id}`);

  return data?.password ?? "";
};

export const fetchDictionariesThunk = () => async (dispatch) => {
  try {
    const { data } = await apiPrivate.get(dictionariesUrl);

    dispatch(setDictionaries({
      positions: data.positions,
      userTypes: data.userTypes,
      departments: data.departments,
      phones: data.phonesResult,
      users: data.users,
      sections: data.sections,
      deps: data.deps
    }));
  } catch (err) {
    console.error("Dictionaries error:", err.message);
    throw err;
  }
};

export const changeOrderOfDisplayElements = async (
  elements,
  menu,
  depId,
  currentMode
) => {
  const dataToPush = elements.map((el) => ({
    id: el.id,
    priority: el.priority,
  }));

  const pageName = currentMode || "mails";

  const sendUrl = changeOrderUrl(pageName);

  return apiPrivate.post(sendUrl, dataToPush);
};

// ---------------- GENERIC CRUD ----------------

export const apiAddEntity = (endpoint, payload) => {
  return apiPrivate.post(`/api/${endpoint}`, payload);
};

export const apiEditEntity = (endpoint, { id, ...data }) => {
  return apiPrivate.put(`/api/${endpoint}/${id}`, data);
};

export const apiDeleteEntity = (endpoint, ids) => {
  return apiPrivate.post(`/api/${endpoint}/delete`, ids);
};

// ---------------- MAILS ----------------

export const addMail = (data, mailType) => {
  return apiPrivate.post(`/api/mails/${mailType}`, data);
};

export const editMail = ({
  id,
  menu,
  ...data
}) => {
  return apiPrivate.put(
    `/api/mails/${menu}/${id}`,
    data
  );
};

export const deleteMail = (ids) => {
  return apiDeleteEntity("mails", ids);
};

// ---------------- ASSIGN PHONES ----------------

export const apiAssignPhonesToUser = (data) => {
  return apiPrivate.put(`/api/assignPhonesToUsers`, data);
};