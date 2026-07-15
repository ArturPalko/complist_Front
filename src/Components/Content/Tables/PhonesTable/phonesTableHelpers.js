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
    if (rowType === "section") {
      
      dispatch(
        setActiveSection({
          id: item.sectionId,
          name: item.sectionName,
        })
      );
      return;
    }

    if ((isSections || isAddUsers) && item?.type === "department") {
      dispatch(
        setActiveDepartment({
          id: item.departmentId,
          name: item.departmentName,
        })
      );
    }
  };


export const handleBack =
  ({
    activeDep,
    activeSec,
    isSections,
    isAddUsers,
    dispatch,
  }) =>
  () => {

    // Користувачі секції -> секції
    if (activeSec != null) {
      dispatch(
        setActiveSection({
          id: null,
          name: null,
        })
      );

      return;
    }

    // Секції департаменту -> департаменти
    if (
      activeDep != null &&
      activeSec == null &&
      isSections &&
      isAddUsers
    ) {

      
      dispatch(toggleaddUsersMode());

      dispatch(
        setActiveDepartment({
          id: null,
          name: null,
        })
      );

      return;
    }

    // Секції -> департаменти
    dispatch(
      setActiveDepartment({
        id: null,
        name: null,
      })
    );

    dispatch(
      setActiveSection({
        id: null,
        name: null,
      })
    );
  };





  export const hasItems = (row, isAddUsers) => {
  switch (row.type) {
    case "department":
      return isAddUsers
        ? (row.users?.length ?? 0) > 0
        : (row.sections?.length ?? 0) > 0;

    case "section":
      return (row.users?.length ?? 0) > 0;

    default:
      return false;
  }
};

export const getItemsCount = (row, isAddUsers) => {
  switch (row.type) {
    case "department":
      return isAddUsers
        ? row.users?.length ?? 0
        : row.sections?.length ?? 0;

    case "section":
      return isAddUsers
        ? row.users?.length ?? 0
        : 0;

    default:
      return 0;
  }
};

export const shouldShowActionButton = (
  row,
  isSections,
  isAddUsers
) => {
  switch (row.type) {
    case "department":
      return isSections || isAddUsers;

    case "section":
      return isAddUsers;

    default:
      return false;
  }
};