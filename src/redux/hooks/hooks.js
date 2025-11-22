import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { rememberPreviousLocationActionCreator } from "../pagesNavbar-reducer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPhonesPageIndexDataOfFoundResults, getGovUaMailsPageIndexDataOfFoundResults,
  getLotusMailsPageIndexDataOfFoundResults, getCurrentPageNumberByKey, getPageIndexDataOfFoundResultsByKey,
  getFilteredState
 } from "../selectors/selector";
import redArrow from "../../../src/assets/red_arrow.png";
import { DataLoaderContext } from "../hocs/withDataLoader";
import { ToggleElementsContext } from "../hocs/withToggleElements";
import { FoundResultsContext } from "../../Components/FoundResults/FoundResults";

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
  baseRoute,
  ro
) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [clickedRow, setClickedRow] = useState(null);
  const navigate = useNavigate();
  const rowRefs = ro;
  //debugger

  const handleClick = (index) => {
    setClickedRow(index);
    const arrow = rowRefs.current[index];
    if (arrow) {
      const onTransitionEnd = () => {
        const targetPage =
          indexDataOfFoundResultsForFoundResultsPage[index]?.currentPage;
          //debugger;
        if (targetPage) navigate(`/${baseRoute}/${targetPage}`);
        arrow.removeEventListener("transitionend", onTransitionEnd);
      };
      arrow.addEventListener("transitionend", onTransitionEnd);
    }
  };

 const renderIndexCell = (index) => {
  if (!indexDataOfFoundResultsForFoundResultsPage) return null;

  return (
    <td
      className={s.cell}
      onMouseEnter={() => setHoveredRow(index)}
      onMouseLeave={() => setHoveredRow(null)}
      onClick={() => handleClick(index)}
    >
      <div className={s.cellContent}>
        <span className={`${s.text} ${hoveredRow === index ? s.hideText : ""}`}>
          Сторінка: {indexDataOfFoundResultsForFoundResultsPage[index].currentPage}, 
          Стрічка: {indexDataOfFoundResultsForFoundResultsPage[index].index}
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
export const useToggleElements = () => useContext(ToggleElementsContext);
export const useFoundResults = () => {
  const context = useContext(FoundResultsContext);
  return context ?? { foundResults: null, indexDataOfFoundResultsForFoundResultsPage: null };
};










export const useFilteredPageData = (mailsData) => {
  const activeMenu = useSelector(activeMenuSelector);
  const filtredChunks = useSelector(state => getIndexesOfFiltredResults(state, activeMenu));

  if (!Array.isArray(mailsData) || !Array.isArray(filtredChunks)) return [];

  const mappedChunks = filtredChunks.map((chunk) => {
    const rows = chunk.rows
      .map(row => {
        const page = mailsData.find(p => p.pageIndex === row.page); 
        if (!page || !Array.isArray(page.rows)) return null;
        return page.rows[row.index]; 
      })
      .filter(Boolean); 

    return rows.length > 0 ? { pageIndex: chunk.pageIndex, rows } : null;
  }).filter(Boolean);

  return mappedChunks;
};
