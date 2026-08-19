import { pageConfigs } from "../configs/app/pageConfig.js";
import { Pages } from "../configs/app/constants.js";

export const passwordUrls = {
  [Pages.LOTUS]: `/api${pageConfigs[Pages.LOTUS].basePath}passwords`,
  [Pages.GOV_UA]: `/api${pageConfigs[Pages.GOV_UA].basePath}passwords`,
};

export const dataUrls = {
  [Pages.PHONES]: pageConfigs[Pages.PHONES].basePath,
  [Pages.LOTUS]: pageConfigs[Pages.LOTUS].basePath,
  [Pages.GOV_UA]: pageConfigs[Pages.GOV_UA].basePath,
};

export const loginUrl = "/login";
export const logoutUrl = "/logout";

export const dictionariesUrl = "/api/dictionaries";

export const positionsUrl = "/api/positions";

export const changeOrderUrl = (pageName) =>
  `/api/changeOrder/${pageName}`;