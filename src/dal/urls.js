import { pageConfigs } from "../configs/app/pageConfig.js";
import { Pages } from "../configs/app/constants.js";

// Password URLs формуються на основі basePath + 'passwords'
export const passwordUrls = {
  [Pages.LOTUS]: `${pageConfigs[Pages.LOTUS].basePath}passwords`,
  [Pages.GOV_UA]: `${pageConfigs[Pages.GOV_UA].basePath}passwords`,
};

// Data URLs формуються просто як basePath сторінок
export const dataUrls = {
  [Pages.PHONES]: pageConfigs[Pages.PHONES].basePath,
  [Pages.LOTUS]: pageConfigs[Pages.LOTUS].basePath,
  [Pages.GOV_UA]: pageConfigs[Pages.GOV_UA].basePath,
};