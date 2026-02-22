
import PhonesPage from "../../Components/Content/Pages/Phones/Phones.jsx"
import LotusMails from "../../Components/Content/Pages/LotusMails/LotusMails.jsx";
import GovUaMails from "../../Components/Content/Pages/GovUaMails/GovUaMails.jsx";
import { Pages } from "./constants.js";
export const pageComponents = {
  [Pages.PHONES]: PhonesPage,
  [Pages.LOTUS]: LotusMails,
  [Pages.GOV_UA]: GovUaMails
};

export const getPageComponent = (pageKey) => pageComponents[pageKey] || null;
