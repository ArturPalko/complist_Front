// pageComponents.js
import PhonesPage from "../Components/Phones/Phones.jsx";
import LotusMails from "../Components/LotusMails/LotusMails.jsx";
import GovUaMails from "../Components/GovUaMails/GovUaMails.jsx";
import { Pages } from "./constants";

export const pageComponents = {
  [Pages.PHONES]: PhonesPage,
  [Pages.LOTUS]: LotusMails,
  [Pages.GOV_UA]: GovUaMails
};

export const getPageComponent = (pageKey) => pageComponents[pageKey] || null;
