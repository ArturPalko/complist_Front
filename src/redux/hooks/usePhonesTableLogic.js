// usePhonesTableLogic.js
import { useSelector } from "react-redux";
import { useTableBaseLogic } from "../../Components/CommonInjection/hooks/useTableBaseLogic";
import { getDepartmentsAndSectionsPerPage } from "../selectors/selector";
import { getDimGroupRowClasses } from "../../Components/PhonesTable/phonesTableHelpers";
import s from "../../Components/PhonesTable/PhonesTable.module.css";

export const usePhonesTableLogic = (props) => {
  // ===== Викликаємо базовий хук для універсальної логіки =====
  const tableLogic = useTableBaseLogic({ ...props });

  // ===== Специфічна логіка тільки для PhonesTable =====
  const indexDecrementFromPreviousPages = useSelector(getDepartmentsAndSectionsPerPage)
    .slice(0, props.pageNumber - 1)
    .reduce((acc, val) => acc + val, 0);

  // ===== Обчислення dim-класів для рендеру рядків =====
  const dimClasses = getDimGroupRowClasses({
    hasFoundResults: props.indexesOfFoundResultsForCurrentPage?.length > 0,
    showPreviousPageHighlight: tableLogic.showPreviousPageHighlight,
    isPagesNavbarLinkElementOnCurrentPagePressed: tableLogic.isPagesNavbarLinkElementOnCurrentPagePressed,
    styles: s,
  });

  return {
    ...tableLogic,
    indexDecrementFromPreviousPages,
    dimClasses, // { dimAfterSearchNavigationClass, dimAfterPageNumberPressedClass }
  };
};
