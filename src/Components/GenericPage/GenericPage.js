import React, { useRef } from "react";
import TopTableBar from "../TopTableBar/TopTableBar";
import { rowsPerPage } from "../CommonInjection/Dependencies/ComponentImports";
import { useIndexesForPage, usePageNumber } from "../../redux/hooks/hooks";
import { pageConfigs } from "../../redux/selectors/pageConfig";
import { connect } from "react-redux";
import { getDepartmentsAndSectionsPerPage } from "../../redux/selectors/selector";

const GenericPage = ({
  pageName,
  showPasswords,
  passwordsMap,
  getDepartmentsAndSectionsPerPage
}) => {
  // 🔹 ХУКИ — ЗАВЖДИ ПЕРШІ
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

  return (
    <>
      <TopTableBar
        ref={titleRef}
        title={config.title}
        mailType={config.mailType}
      />

      <config.TableComponent
        mailType={config.mailType}
        titleRef={titleRef}
        columns={config.columns}
        rowsPerPage={rowsPerPage}
        pageNumber={pageNumber}
        indexesOfFoundResultsForCurrentPage={indexes}
        showPasswords={showPasswords}
        passwordsMap={passwordsMap}
        {...extraProps}
      />
    </>
  );
};


const mapStateToProps = (state) => ({
  getDepartmentsAndSectionsPerPage: (menu) =>
    getDepartmentsAndSectionsPerPage(state, menu),
});

export default connect(mapStateToProps)(GenericPage);
