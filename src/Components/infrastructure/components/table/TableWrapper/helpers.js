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
