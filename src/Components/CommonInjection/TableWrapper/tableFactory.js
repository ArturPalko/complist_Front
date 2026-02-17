import React, { useRef, useContext } from "react";
import { useFoundResults } from "../../../redux/hooks/hooks";
import TableWrapper from "./TableWrapper";
import { PageContext } from "../../GenericPage/GenericPage";

export const createTableComponent = (useTableLogic, s) => {
  return function TableComponent(props) {
    const headerRef = useRef(null);

    const {
      foundResults,
      indexDataOfFoundResultsForFoundResultsPage
    } = useFoundResults() || {
      foundResults: [],
      indexDataOfFoundResultsForFoundResultsPage: []
    };

    const pageContext = useContext(PageContext);


    const {
        titleRef,
     columns,
      pageNumber,
      indexesOfFoundResultsForCurrentPage
    } = pageContext;

    const commonProps = { ...props, headerRef };

    const baseLogic = useTableLogic({
      ...commonProps,
      foundResults,
      indexesOfFoundResultsForCurrentPage,
       titleRef,
     columns,
      pageNumber
    });

    const tableLogic = {
      ...baseLogic,
      headerRef,
      indexDataOfFoundResultsForFoundResultsPage,
      indexesOfFoundResultsForCurrentPage,
      foundResults
      
    };

    return (
      <TableWrapper
        tableLogic={tableLogic}
        renderHeader={props.renderHeader}
        renderRowCells={(row, index) =>
          props.renderRowCells(row, index, tableLogic)
        }
      />
    );
  };
};
