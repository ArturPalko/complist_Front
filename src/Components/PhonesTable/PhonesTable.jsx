import s from "./PhonesTable.module.css";
import Preloader from "../Preloader/Preloader";
import redArrow from '../../assets/red_arrow.png';
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PhonesTable = ({
  foundResults,
  phonesData,
  isDataFetching,
  columns,
  pageNumber,
  rowsPerPage,
  indexDataOfFoundResultsForFoundResultsPage,
  indexesOfFoundResultsForCurrentPage,
  isPagesNavbarLinkElementOnCurrentPagePressed,
  isRenderFromFoundResultsPage,
  isPreviousPageWasFoundResult
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [clickedRow, setClickedRow] = useState(null);
  const navigate = useNavigate();
  const rowRefs = useRef({});



//console.log ("isPagesNavbarLinkElementOnCurrentPagePressed", isPagesNavbarLinkElementOnCurrentPagePressed);

  let pageData = foundResults ?? phonesData?.[pageNumber - 1]?.rows ?? [];
  let indexDecrement = 0;
  const phoneColumns = columns.find(c => c.key === "phones")?.subLabels.length || 0;

  const handleClick = (index) => {
    setClickedRow(index);
    const arrow = rowRefs.current[index];
    if (arrow) {
      const onTransitionEnd = () => {
        navigate(`/phones/${indexDataOfFoundResultsForFoundResultsPage[index].currentPage}`);
        arrow.removeEventListener("transitionend", onTransitionEnd);
      };
      arrow.addEventListener("transitionend", onTransitionEnd);
    }
  };

 console.log("indexDataOf:",indexDataOfFoundResultsForFoundResultsPage);

     const renderIndexCell = (index) => {
       if (!indexDataOfFoundResultsForFoundResultsPage) return null;
        return (
         <td
           className={s.cell}
           onMouseEnter={() => setHoveredRow(index)}
           onMouseLeave={() => setHoveredRow(null)}
           onClick={() => handleClick(index)}
         >
           <span className={`${s.text} ${hoveredRow === index ? s.hideText : ""}`}>
             Сторінка: {indexDataOfFoundResultsForFoundResultsPage[index].currentPage}, Стрічка: {indexDataOfFoundResultsForFoundResultsPage[index].index}
           </span>
           <img
             ref={(el) => (rowRefs.current[index] = el)}
             src={redArrow}
             alt="arrow"
             className={`${s.arrow} ${hoveredRow === index ? s.showArrow : ""} ${clickedRow === index ? s.moveRight : ""}`}
           />
         </td>
       );
     };
const showDigitsFromPressed =
  indexesOfFoundResultsForCurrentPage.length !== 0 &&
  isPagesNavbarLinkElementOnCurrentPagePressed
    ? s.showColnumbersWhenPagesLinkOnCurrentPagePressed
    : "";
  return (
 
    <div className={s.content}>
        <div className={s.tableWrapper + " " + showDigitsFromPressed}>
         {((isPreviousPageWasFoundResult || isPagesNavbarLinkElementOnCurrentPagePressed )&& indexesOfFoundResultsForCurrentPage.length !== 0) && <div className={s.colNumbers}>
            {Array.from({ length: pageData.length}, (_, i) => (
              <div  key={i}>{i+1}</div>
            ))}
         </div>}
  
          <table>
            <thead>
              <tr>
                <th rowSpan="2">№ п/п</th>
                {columns.map((col) =>
                  col.key === "phones" ? (
                    <th key={col.key} colSpan={col.subLabels.length}>{col.label}</th>
                  ) : (
                    <th key={col.key} rowSpan="2">{col.label}</th>
                  )
                )}
                {indexDataOfFoundResultsForFoundResultsPage && <th rowSpan="2">Індекси</th>}
              </tr>
              <tr>
                {columns
                  .filter(c => c.key === "phones")
                  .flatMap(col =>
                    col.subLabels.map(sub => <th key={sub.key}>{sub.label}</th>)
                  )}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row, index) => {
            const rowClass = indexesOfFoundResultsForCurrentPage?.includes(index + 1) && isPreviousPageWasFoundResult
              ? `${s.searchedRow} ${(index + 1) % 2 === 0 ? s.even : s.odd}`
              : "";
              const rowClassFronPressed = indexesOfFoundResultsForCurrentPage?.includes(index + 1) && isPagesNavbarLinkElementOnCurrentPagePressed ? s.focusOnsearchedResultsWhenPagesLinkOnCurrentPagePressed : '';


                const hideClass = indexesOfFoundResultsForCurrentPage.length !== 0 && isPreviousPageWasFoundResult ? s.hideBright : "";
                const hideClassFromPressed =indexesOfFoundResultsForCurrentPage.length !== 0 && isPagesNavbarLinkElementOnCurrentPagePressed ? s.hideBrightWhenPagesLinkOnCurrentPagePressed: '';
                

                //debugger;

                switch (row.type) {
                  case "department":
                    indexDecrement++;
                    return (
                      <tr
                        key={`dep-${row.departmentId}`}
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                        onClick={() => handleClick(index)}
                        
                      >
                          <td className={`${s.mainDepartment}  ${hideClass} ${hideClassFromPressed}`} 
                          colSpan={columns.length + phoneColumns}>
                          {row.departmentName}
                        </td>
                        {renderIndexCell(index)}
                      </tr>
                    );

                  case "section":
                    indexDecrement++;
                    return (
                      <tr
                        key={`sec-${row.sectionId}`}
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                        onClick={() => handleClick(index)}
                    
                        data-index={index}
                      >
                        <td className={`${s.section} ${hideClass} ${ hideClassFromPressed}`}
                          colSpan={columns.length + phoneColumns}>
                          {row.sectionName}
                        </td>
                         {renderIndexCell(index)} 
                      </tr>
                    );

                  case "user":
                    return (
                      <tr
                        key={`user-${row.userId}`}
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                        onClick={() => handleClick(index)}
                      className={`${rowClass} ${rowClassFronPressed}`}

                        data-index={index}
                      >
                        <td>{(pageNumber - 1) * rowsPerPage + index + 1 - indexDecrement}</td>
                        {row.userTypeId !== 1 ? (
                          <>
                            <td>{row.userName}</td>
                            <td></td>
                          </>
                        ) : (
                          <>
                            <td>{row.userPosition}</td>
                            <td>{row.userName}</td>
                          </>
                        )}
                        {columns.find(c => c.key === "phones")?.subLabels.map(sub => {
                          const phone = row.phones?.find(p => p.phoneType === sub.label);
                          return <td key={sub.key}>{phone ? phone.phoneName : ""}</td>;
                        })}
                         {renderIndexCell(index)} 
                      </tr>
                    );

                  default:
                    return null;
                }
              })}
            </tbody>
          </table>
      </div>
    </div>
  );
};

export default PhonesTable;
