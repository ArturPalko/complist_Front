import axios from "axios";
import axiosRetry from "axios-retry";

export const api = axios.create({
  baseURL: "http://localhost:5114", 
  timeout: 10000 
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
  const urlMap = {
    Lotus: "/mails/Lotus/passwords",
    "Gov-ua": "/mails/Gov-ua/passwords"
  };

  if (!urlMap[type]) throw new Error(`No password URL for type "${type}"`);

  const { data } = await api.get(urlMap[type]);
  const map = {};
  data.forEach(item => (map[item.id] = item.password));
  return map;
};
