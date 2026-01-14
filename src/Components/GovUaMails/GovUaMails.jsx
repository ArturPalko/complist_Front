import React, { useRef } from "react";
import { compose } from "redux";
import MailsTable from "../MalisTable/MailsTable";
import TopTableBar from "../TopTableBar/TopTableBar";
import { rowsPerPage } from "../CommonInjection/Dependencies/ComponentImports";
import { useIndexesForPage, usePageNumber } from "../../redux/hooks/hooks";
import withToggleElements from "../../redux/hocs/withToggleElements";
import withDataLoaderForMenu from "../../redux/hocs/withDataLoader";
import { getMailsData } from "../../redux/mails-reducer";

const GovUAPage = (props) => {
  const pageName = "Gov-ua";
  const indexesOfFoundResultsForCurrentPage = useIndexesForPage(pageName);
  const pageNumber = usePageNumber();

  const titleRef = useRef(null);

  return (
    <>
      <TopTableBar
        ref={titleRef}
        title="Поштові скриньки customs.gov.ua"
        mailType={pageName.toLowerCase()}
      />
      <MailsTable
        titleRef={titleRef}
        mailType={pageName}
        columns={[
          { key: "mailName", label: "найменування скриньки" },
          { key: "departmentOrSection", label: "найменування підрозділу" },
          { key: "responsibleUser", label: "відповідальна особа" },
        ]}
        showPasswords={props.showPasswords}        // береться з HOC
        passwordsMap={props.passwordsMap}          // береться з HOC
        rowsPerPage={rowsPerPage}
        pageNumber={pageNumber}
        indexesOfFoundResultsForCurrentPage={indexesOfFoundResultsForCurrentPage}
      />
    </>
  );
};

export default compose(
  // Використовуємо універсальний HOC для Gov-ua
  withDataLoaderForMenu("Gov-ua", getMailsData),
  withToggleElements("Gov-ua")
)(GovUAPage);
