import { useSelector } from "react-redux";
import { useTableBaseLogic } from "../../shared/hooks/useTableBaseLogic";
import { getDepartmentsAndSectionsPerPage, selectDashedBlocks } from "../selectors/selector";
import { getDimGroupRowClasses } from "../../Components/Content/Tables/PhonesTable/phonesTableHelpers";
import s from "../../Components/Content/Tables/PhonesTable/PhonesTable.module.css";

export const usePhonesTableLogic = (props) => {
  // ===== Базова логіка =====
  const tableLogic = useTableBaseLogic({ ...props });

  // ===== Обчислення індексів для номера користувача =====
  const indexDecrementFromPreviousPages = useSelector(getDepartmentsAndSectionsPerPage)
    .slice(0, props.pageNumber - 1)
    .reduce((acc, val) => acc + val, 0);

  // ===== dim-класи для рендеру рядків =====
  const dimClasses = getDimGroupRowClasses({
    hasFoundResults: props.indexesOfFoundResultsForCurrentPage?.length > 0,
    showPreviousPageHighlight: tableLogic.showPreviousPageHighlight,
    isPagesNavbarLinkElementOnCurrentPagePressed: tableLogic.isPagesNavbarLinkElementOnCurrentPagePressed,
    styles: s,
  });

  // ===== Нове: розриви департаментів і секцій =====
  const dashedBlocks = useSelector(selectDashedBlocks); // { departments: [], sections: [] }

  return {
    ...tableLogic,
    indexDecrementFromPreviousPages,
    dimClasses,
    dashedBlocks, // додаємо сюди
  };
};