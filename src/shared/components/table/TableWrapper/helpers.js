import s from "./TableWrapper.module.css"

export const getRowClass = ({
  index,
  indexesOfFoundResults = [],
  showPreviousPageHighlight = false,
  isPagesNavbarLinkPressed = false
}) => {
  const highLightAfterFoundResultsPageClass =
    indexesOfFoundResults.includes(index + 1) && showPreviousPageHighlight
      ? `${s.focusOnSearchedRowFade} ${index % 2 === 0 ? s.even : s.odd}`
      : "";

  const highLightAfterCurrentPageNumberPressedClass =
    indexesOfFoundResults.includes(index + 1) && isPagesNavbarLinkPressed
      ? s.focusOnSearchedRow
      : "";

  return `${highLightAfterFoundResultsPageClass} ${highLightAfterCurrentPageNumberPressedClass}`;
};

export const getDragClass = ({ editMode, isDragging, isSelected }) =>
  [
    editMode ? "row-edit" : "row-edit-default",
    isDragging && "row-dragging",
    isSelected && "row-selected",
  ]
    .filter(Boolean)
    .join(" ");


export const getDropPositionClass = ({
  isAfter,
  isBefore,
}) => {
  const classes = [
    isAfter && "drag-after",
    isBefore && "drag-before",
  ].filter(Boolean);


  return classes.join(" ");
};