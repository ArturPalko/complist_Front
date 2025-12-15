import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { rememberPreviousLocationActionCreator } from "../pagesNavbar-reducer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPhonesPageIndexDataOfFoundResults, getGovUaMailsPageIndexDataOfFoundResults,
  getLotusMailsPageIndexDataOfFoundResults, getCurrentPageNumberByKey, getPageIndexDataOfFoundResultsByKey,
  getFilteredState , isFilterAppliedSelector
 } from "../selectors/selector";
import redArrow from "../../../src/assets/red_arrow.png";
import { DataLoaderContext } from "../hocs/withDataLoader";
import { FoundResultsContext } from "../../Components/FoundResults/FoundResults";
import { useMemo } from "react";
import { SearchToggleContext, PasswordsToggleContext } from "../hocs/withToggleElements";

import { activeMenu as activeMenuSelector, getIndexesOfFiltredResults, getGovUaMails, getLotusMails } from "../selectors/selector";



export const usePageNumber = () => {
  const params = useParams();
  return Number(params.pageNumber) || 1;
};


export const useTrackLocation = () => {
  const location = useLocation();
  const prevPathRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (prevPathRef.current && prevPathRef.current !== location.pathname) {
      dispatch(rememberPreviousLocationActionCreator(prevPathRef.current));
    }
    prevPathRef.current = location.pathname;
  }, [location, dispatch]);
};

export const useCurrentPageIndexData = (activeMenu) => {
  const phonesData = useSelector(getPhonesPageIndexDataOfFoundResults);
  const lotusData = useSelector(getLotusMailsPageIndexDataOfFoundResults);
  const govUaData = useSelector(getGovUaMailsPageIndexDataOfFoundResults);


  switch(activeMenu) {
    case "phones":
      return phonesData || [];
    case "Lotus":
      return lotusData || [];
    case "Gov-ua":
      return govUaData || [];
    default:
      return [];
  }
};

export const useIndexesForPage = (pageKey) => {
  const pageNumber = useSelector(state => getCurrentPageNumberByKey(pageKey)(state));
  const data = useSelector(state => getPageIndexDataOfFoundResultsByKey(pageKey.toLowerCase())(state)) || [];

  const indexes = data
     .filter(item => Number(item.currentPage) === Number(pageNumber))
    .map(item => item.index);
  return indexes;
};


export const useRowHighlighting = (
  indexDataOfFoundResultsForFoundResultsPage,
  s,
  menu,
  rowRefs,
  safeIndexData
) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [clickedRow, setClickedRow] = useState(null);
  const navigate = useNavigate();

const handleClick = (index) => {
  const cellData = indexDataOfFoundResultsForFoundResultsPage?.[index];
  if (!cellData) return;

  const targetPage = cellData.currentPage;

  let url;
  if (menu === "phones") {
    url = `/phones/${targetPage}`;
  } else {
    url = `/mails/${menu}/${targetPage}`;
  }

  // 1. Встановлюємо стан для анімації
  setClickedRow(index);

  // 2. Використовуємо requestAnimationFrame для гарантованого відмалювання класу
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // 3. Навігація після тривалості анімації
      setTimeout(() => {
        navigate(url);
      }, 300); // тривалість анімації moveRight
    });
  });
};


  const renderIndexCell = (index) => {
    const cellData = indexDataOfFoundResultsForFoundResultsPage?.[index];
    if (!cellData) return null;

    return (
      <td
        className={s.cell}
        onMouseEnter={() => setHoveredRow(index)}
        onMouseLeave={() => setHoveredRow(null)}
        onClick={() => handleClick(index)}
      >
        <div className={s.cellContent}>
          <span className={`${s.text} ${hoveredRow === index ? s.hideText : ""}`}>
            Сторінка: {cellData.currentPage}, Стрічка: {cellData.index}
          </span>
          <img
            ref={(el) => (rowRefs.current[index] = el)}
            src={redArrow}
            alt="arrow"
            className={`${s.arrow} ${hoveredRow === index ? s.showArrow : ""} ${clickedRow === index ? s.moveRight : ""}`}
          />
        </div>
      </td>
    );
  };

  return { renderIndexCell };
};

export const useDataLoader = () => useContext(DataLoaderContext);
// export const useToggleElements = () => useContext(ToggleElementsContext);
export const useFoundResults = () => {
  const context = useContext(FoundResultsContext);
  return context ?? { foundResults: null, indexDataOfFoundResultsForFoundResultsPage: null };
};


// для чекбокса пошуку
export const useSearchToggle = () => useContext(SearchToggleContext);

// для показу паролів
export const usePasswordsToggle = () => useContext(PasswordsToggleContext);






export const useFilteredPageData = (mailsData) => {
  const activeMenu = useSelector(activeMenuSelector);
  const filtredChunks = useSelector(state => getIndexesOfFiltredResults(state, activeMenu));
  const isFilterApplied = useSelector(isFilterAppliedSelector(activeMenu));

  return useMemo(() => {
    if (!Array.isArray(mailsData)) return { data: [], isFilterApplied: false };

    if (isFilterApplied) {
      if (!Array.isArray(filtredChunks) || filtredChunks.length === 0) {
        return { data: [], isFilterApplied: true };
      }

      const mappedChunks = filtredChunks
        .map(chunk => {
          const rows = chunk.rows
            .map(row => {
              const page = mailsData.find(p => p.pageIndex === row.page);
              return page?.rows?.[row.index] ?? null;
            })
            .filter(Boolean);

          return rows.length > 0 ? { pageIndex: chunk.pageIndex, rows } : null;
        })
        .filter(Boolean);

      return { data: mappedChunks, isFilterApplied: true };
    }

    return { data: mailsData, isFilterApplied: false };
  }, [mailsData, filtredChunks, isFilterApplied]);
};



export const useFoundResultsColNumbersLogic = ({
  isFoundResults,
  indexesOfFoundResultsForCurrentPage = [],
  isPagesNavbarLinkPressed,
  isPreviousPageWasFoundResult,
}) => {
  const [showPreviousPageHighlight, setShowPreviousPageHighlight] = useState(false);

  // Клас для анімації колонки
  const showDigitsFromPressed =
    isFoundResults &&
    indexesOfFoundResultsForCurrentPage.length > 0 &&
    isPagesNavbarLinkPressed
      ? "showColnumbersWhenPagesLinkOnCurrentPagePressed"
      : "";

  // Чи відображати блок colNumbers
  const shouldShowColNumbers =
    indexesOfFoundResultsForCurrentPage.length > 0 &&
    (isPagesNavbarLinkPressed || showPreviousPageHighlight);

  useEffect(() => {
    let timer;
    if (isPreviousPageWasFoundResult) {
      setShowPreviousPageHighlight(true);
      timer = setTimeout(() => setShowPreviousPageHighlight(false), 3000);
    } else {
      setShowPreviousPageHighlight(false);
    }
    return () => clearTimeout(timer);
  }, [isPreviousPageWasFoundResult]);

  return {
    showDigitsFromPressed,
    shouldShowColNumbers,
    showPreviousPageHighlight,
  };
};
