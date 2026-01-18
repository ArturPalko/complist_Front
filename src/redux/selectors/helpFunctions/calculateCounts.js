import { countPhoneData } from "./countPhonesData";
import { countMailData } from "./countMailsData";

/**
 * Карта функцій підрахунку для меню
 * Ключ — назва меню, значення — відповідна функція підрахунку
 */
const countByMenu = {
  phones: countPhoneData,
  Lotus: countMailData,
  "Gov-ua": countMailData
  // сюди можна додавати нові меню
};

/**
 * calculateCounts - універсальна функція підрахунку
 * @param {Array|Object} data - дані для меню (тільки для цього меню)
 * @param {string} menu - активне меню
 * @returns {Object} counts для меню
 */
export const calculateCounts = (data, menu) => {
  const counter = countByMenu[menu] || countMailData; // дефолтна функція
  return counter(data);
};
