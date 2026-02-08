import React, { useRef } from "react";
import TopTableBar from "../TopTableBar/TopTableBar";
import { rowsPerPage } from "../../configs/constants";
import { useIndexesForPage, usePageNumber } from "../../redux/hooks/hooks";
import {pageConfigs} from "../../configs/pageConfig"
import { connect } from "react-redux";
import { getDepartmentsAndSectionsPerPage } from "../../redux/selectors/selector";

const GenericPage = ({
  pageName,
  showPasswords,
  passwordsMap,
  getDepartmentsAndSectionsPerPage
}) => {

  const titleRef = useRef(null);
  const pageNumber = usePageNumber();
  const indexes = useIndexesForPage(pageName);

  const config = pageConfigs[pageName];

  if (!config) return null;

  const extraProps = {};

  if (config.needsDepartments) {
    extraProps.departmentsAndSectionsPerPage =
      getDepartmentsAndSectionsPerPage(pageName);
  }

  const tableProps = {
    titleRef,
    columns: config.columns,
    rowsPerPage,
    pageNumber,
    indexesOfFoundResultsForCurrentPage: indexes,
    pageName,
    ...extraProps,
    ...(showPasswords !== undefined && { showPasswords }),
    ...(passwordsMap !== undefined && { passwordsMap }),
  };

  return (
    <>
      <TopTableBar
        ref={titleRef}
        title={config.title}
        pageName={pageName}
      />

      <config.TableComponent {...tableProps} />
    </>
  );
};


const mapStateToProps = (state) => ({
  getDepartmentsAndSectionsPerPage: (menu) =>
    getDepartmentsAndSectionsPerPage(state, menu),
});

export default connect(mapStateToProps)(GenericPage);
