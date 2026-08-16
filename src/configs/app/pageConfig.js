import PhonesTable from "../../Components/Content/Tables/PhonesTable/PhonesTable.jsx";
import MailsTable from "../../Components/Content/Tables/MalisTable/MailsTable.jsx"
import DictionaryTable from "../../Components/Content/Tables/DictionaryTable/DicitonaryTable.jsx";
import { Pages } from "./constants.js";
import EllipsesForPhonesSVG from "../../assets/SVG/Diagrams/EllipsesForPhonesSVG.js"
import ConverForLotusSVG from "../../assets/SVG/Diagrams/ConverForLotusSVG.js";
import ConverForGovUaSVG from "../../assets/SVG/Diagrams/ConverForGovUaSVG.js"




export const pageConfigs = {
  [Pages.DICTIONARIES]: {
  StatusDiagram: EllipsesForPhonesSVG,
  title: "Довідники",
  TableComponent: DictionaryTable,
  basePath: "/dictionary/departments/",
  pageFromURLIndex: 2,
  showSearchToggle: true,
},
  [Pages.PHONES]: {
    StatusDiagram: EllipsesForPhonesSVG,
    title: "Телефони",
    TableComponent: PhonesTable,
    columns: [
      { key: "userPosition", label: "Назва посади" },
      { key: "userName", label: "Прізвище, ім'я по батькові" },
      {
        key: "phones",
        label: "Телефон",
        subLabels: [
          { key: "landline", label: "Міський" },
          { key: "extension", label: "Внутрішній" },
          { key: "cisco", label: "IP (Cisco)" },
        ],
      },
    ],
    needsDepartments: true,
    basePath: "/phones/",
    pageFromURLIndex: 1,
    showSearchToggle: true,
    bookmarks: {
            showExtraToggles: true
    }   
    
  },

  [Pages.GOV_UA]: {
    StatusDiagram: ConverForGovUaSVG,
    title: "Поштові скриньки customs.gov.ua",
    TableComponent: MailsTable,
    columns: [
      { key: "mailName", label: "найменування скриньки" },
      { key: "departmentOrSection", label: "найменування підрозділу" },
      { key: "responsibleUser", label: "відповідальна особа" },
    ],
    basePath: "/mails/Gov-ua/",
    pageFromURLIndex: 2,
    showSearchToggle: true,      
    showPasswordsToggle: true,
    
    modalWindows: {
      addMail: {
        title: "Gov-UA",
        showResponsibleUsers: true
      },
    },
  },

  [Pages.LOTUS]: {
    StatusDiagram: ConverForLotusSVG,
    title: "Поштові скриньки Lotus",
    TableComponent: MailsTable,
    columns: [
      { key: "previousName", label: "Стара назва скриньки" },
      { key: "name", label: "Нова назва скриньки" },
      { key: "owner", label: "Назва підрозділу" },
    ],
    basePath: "/mails/Lotus/",
    pageFromURLIndex: 2,
    showSearchToggle: true,      
    showPasswordsToggle: true,
      modalWindows: {
        addMail: {
          title: "Lotus",
          showResponsibleUsers: false,
          showOldMailName: true
        },   
      }
  },
};
