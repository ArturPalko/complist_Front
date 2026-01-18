import { createSelector } from "@reduxjs/toolkit";
import { getDataForMenu } from "../selector.js";
import { countMailData } from "../helpFunctions/countMailsData";
import{countPhoneData}  from "../helpFunctions/countPhonesData";
import { activeMenu } from "../selector.js";

/**
 * Фабрика селектора для кешованого підрахунку counts
 * menu: 'phones' | 'Lotus' | 'Gov-ua' | ...
 */
export const makeGetCountForMenu = createSelector(
  [
    (state) => activeMenu(state),   // активне меню
    (state) => state                // весь state
  ],
  (menu, state) => {
    const data = getDataForMenu(state, menu);

    switch (menu) {
      case "phones":
        return countPhoneData(data);
      case "Lotus":
      case "Gov-ua":
        return countMailData(data);
      default:
        return {};
    }
  }
);
