import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectIndexesFromCell, getLastVisitedPage, activeMenu } from "../selectors/selector";
import { addIndexesFromIndexCell } from "../../redux/reducers/toggledElements-reducer";

export const useRedirectHighlight = ({
  pageNumber,
  defaultIndexes = [],
}) => {
  const dispatch = useDispatch();

  const indexesFromRedux = useSelector(selectIndexesFromCell);
  const menu = useSelector(activeMenu);
  const lastVisitedPage = useSelector(state =>
    getLastVisitedPage(state, menu)
  );

  const [temporaryHighlightIndexes, setTemporaryHighlightIndexes] = useState([]);

  useEffect(() => {
    if (
      !indexesFromRedux ||
      indexesFromRedux.length === 0 ||
      lastVisitedPage === "foundResults"
    ) {
      setTemporaryHighlightIndexes([]);
      return;
    }

    setTemporaryHighlightIndexes(indexesFromRedux);

    const timer = setTimeout(() => {
      setTemporaryHighlightIndexes([]);
      dispatch(addIndexesFromIndexCell([]));
    }, 2000);

    return () => {
      dispatch(addIndexesFromIndexCell([]));
      clearTimeout(timer);
    };
  }, [indexesFromRedux, dispatch, lastVisitedPage, pageNumber]);

  return temporaryHighlightIndexes.length > 0
    ? temporaryHighlightIndexes
    : defaultIndexes;
};