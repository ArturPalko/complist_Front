import { getDataForMenu } from "../selector.js";
import { countPhoneData } from "../helpFunctions/countPhonesData.js";
import { countMailData } from "../helpFunctions/countMailsData.js";
import { createSelector } from "@reduxjs/toolkit";

export const makeGetCountByMenu = (menu) =>
  createSelector(
    [(state) => getDataForMenu(state, menu)],
    (data) => (menu === "phones" ? countPhoneData(data) : countMailData(data))
  );
