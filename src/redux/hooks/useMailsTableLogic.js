// useMailsTableLogic.js
import { useTableBaseLogic } from "../../Components/CommonInjection/hooks/useTableBaseLogic";
import { useSelector } from "react-redux";
import { activeMenu } from "../selectors/selector";

/**
 * MailsTable просто використовує базовий хук
 */
export const useMailsTableLogic = (props) => {
  const menu = useSelector(activeMenu);

  return useTableBaseLogic({
    ...props,
    pageName: menu,
  });
};
