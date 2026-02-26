import { useTableBaseLogic } from "../../shared/hooks/useTableBaseLogic";
import { useSelector } from "react-redux";
import { activeMenu } from "../selectors/selector";


export const useMailsTableLogic = (props) => {
  const menu = useSelector(activeMenu);

  return useTableBaseLogic({
    ...props,
    pageName: menu,
  });
};
