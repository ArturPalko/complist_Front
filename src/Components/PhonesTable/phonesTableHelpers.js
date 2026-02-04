/**
 * Рахує кількість НЕ-user рядків ДО поточного індексу
 * (department / section)
 */
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
