import { useSelector } from "react-redux";
import { useTableBaseLogic } from "../../shared/hooks/useTableBaseLogic";
import {
  getDepartmentsAndSectionsPerPage,
  selectDashedBlocks,
  selectFoundResults,
  isEditModeSelected,
  selectIndexesFromCell,
  getCurrentMode,
} from "../selectors/selector";
import { getDimGroupRowClasses } from "../../Components/Content/Tables/PhonesTable/phonesTableHelpers";
import s from "../../Components/Content/Tables/PhonesTable/PhonesTable.module.css";

export const usePhonesTableLogic = (props) => {
  const tableLogic = useTableBaseLogic({ ...props });

  const index = useSelector((state) => selectIndexesFromCell(state));

  let data = tableLogic.pageData;


  let currentData = data[index - 1];

  let indexValue =
    currentData?.sectionId ||
    currentData?.departmentId ||
    currentData?.id;


  const indexDecrementFromPreviousPages = useSelector(
    getDepartmentsAndSectionsPerPage
  )
    .slice(0, props.pageNumber - 1)
    .reduce((acc, val) => acc + val, 0);

  const dashedBlocks = useSelector(selectDashedBlocks);

  // ==========================================
  // SEARCH RESULTS
  // ==========================================

  const currentMode = useSelector(getCurrentMode);

  const searchMenu = currentMode
    ? "dictionary"
    : "phones";
      
  const foundResults = useSelector((state) =>
    selectFoundResults(state, searchMenu)
  );
      
  // ==========================================
  // EDIT MODE
  // ==========================================

  const isEditMode = useSelector(isEditModeSelected);

  const foundResultsInclude = (id) =>
    foundResults?.some((item) => item.id === id);

  // ==========================================
  // STOP DIMMING
  // ==========================================

  const stopDismiss = (id) => {
          
    if (index.length > 0) {
            
      return (
        foundResultsInclude(indexValue) &&
        isEditMode &&
        indexValue == id
      );
    } else {
      return foundResultsInclude(id) && isEditMode;
    }
  };

  // ==========================================
  // ROW DIM CLASSES
  // ==========================================

  const getRowDimClasses = (id) => {
    if (stopDismiss(id)) {
      return {
        hidden: true,
      };
    }

    return getDimGroupRowClasses({
      hasFoundResults:
        props.indexesOfFoundResultsForCurrentPage?.length > 0,

      showPreviousPageHighlight:
        tableLogic.showPreviousPageHighlight,

      isPagesNavbarLinkElementOnCurrentPagePressed:
        tableLogic.isPagesNavbarLinkElementOnCurrentPagePressed,

      styles: s,
    });
  };

  return {
    ...tableLogic,
    indexDecrementFromPreviousPages,
    dashedBlocks,
    getRowDimClasses,
  };
};