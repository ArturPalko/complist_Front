import PhonesTable from "../../Components/PhonesTable/PhonesTable";
import MailsTable from "../../Components/MalisTable/MailsTable"
import { Pages } from "../../redux/selectors/constants";

export const pageConfigs = {
  [Pages.PHONES]: {
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
    needsDepartments: true
  },

  [Pages.GOV_UA]: {
    title: "Поштові скриньки customs.gov.ua",
    TableComponent: MailsTable,
    mailType: Pages.GOV_UA,
    columns: [
      { key: "mailName", label: "найменування скриньки" },
      { key: "departmentOrSection", label: "найменування підрозділу" },
      { key: "responsibleUser", label: "відповідальна особа" },
    ]
  },

  [Pages.LOTUS]: {
    title: "Поштові скриньки Lotus",
    TableComponent: MailsTable,
    mailType: Pages.LOTUS,
    columns: [
      { key: "previousName", label: "Стара назва скриньки" },
      { key: "name", label: "Нова назва скриньки" },
      { key: "owner", label: "Назва підрозділу" },
    ]
  }
};
