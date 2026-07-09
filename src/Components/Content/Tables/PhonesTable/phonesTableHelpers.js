/**
 * Рахує кількість НЕ-user рядків ДО поточного індексу
 * (department / section)
 */
import { setActiveDepartment, setActiveSection, toggleaddUsersMode } from "../../../../redux/reducers/ui-reducer";

export const getUserCells = (row) => {
  if (row.userTypeId !== 1) {
    return [row.userName, null];
  }

  return [row.userPosition, row.userName];
};

export const countNonUserRowsBefore = (pageData, index) => {
  return pageData
    .slice(0, index)
    .filter((row) => row.type !== "user")
    .length;
};

/**
 * Обчислює порядковий номер user-рядка в таблиці
 */
export const getUserRowIndex = ({
  pageNumber,
  rowsPerPage,
  index,
  nonUserRowsBefore,
  indexDecrementFromPreviousPages,
}) => {
  return (
    (pageNumber - 1) * rowsPerPage +
    index +
    1 -
    nonUserRowsBefore -
    indexDecrementFromPreviousPages
  );
};

/**
 * Формує класи для приглушення (dim) group rows
 * (department / section)
 */
export const getDimGroupRowClasses = ({
  hasFoundResults,
  showPreviousPageHighlight,
  isPagesNavbarLinkElementOnCurrentPagePressed,
  styles,
}) => {
  const dimAfterSearchNavigationClass =
    hasFoundResults && showPreviousPageHighlight
      ? styles.dimGroupRowFade
      : "";

  const dimAfterPageNumberPressedClass =
    hasFoundResults && isPagesNavbarLinkElementOnCurrentPagePressed
      ? styles.dimGroupRow
      : "";

  return {
    dimAfterSearchNavigationClass,
    dimAfterPageNumberPressedClass,
  };
};

  export const handleOnOpenSectionsButtonClick =
  ({ rowType, isSections, isAddUsers, item, dispatch }) =>
  (e) => {
   // e.stopPropagation();
   if (rowType == "section"){
    debugger
    dispatch(setActiveSection(item.sectionId))
   }
     debugger 
    if ((isSections || isAddUsers)  && item?.type === "department") {
      debugger  
      dispatch(setActiveDepartment(item.departmentId));
      return;
    }
  };



export const handleBack =
  ({ activeSec, isAddUsers, dispatch }) =>
  () => {
    debugger
    if (activeSec != null) {
      debugger
      dispatch(setActiveSection(null));
      return;
    }

    // if (isAddUsers) {
    //   debugger
    //   dispatch(toggleaddUsersMode());
    //   dispatch(setActiveDepartment(null));
    //   return;
    // }
debugger
    dispatch(setActiveDepartment(null));
    dispatch(setActiveSection(null));
  };