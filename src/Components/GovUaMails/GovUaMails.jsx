import React, { useRef } from "react";
import { compose } from "redux";
import MailsTable from "../MalisTable/MailsTable";
import TopTableBar from "../TopTableBar/TopTableBar";
import { rowsPerPage } from "../CommonInjection/Dependencies/ComponentImports";
import { useIndexesForPage, usePageNumber } from "../../redux/hooks/hooks";
import withToggleElements from "../../redux/hocs/withToggleElements";
import withDataLoaderForMenu from "../../redux/hocs/withDataLoader";
import { getMailsData } from "../../redux/mails-reducer";



import { getDataByMenu } from "../../redux/data-reducer"; // 👈 універсальний thunk

const GovUAPage = (props) => {
  const pageName = "Gov-ua";

  const titleRef = useRef(null);
  const pageNumber = usePageNumber();
  const indexesOfFoundResultsForCurrentPage =
    useIndexesForPage(pageName);

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
        showPasswords={props.showPasswords}
        passwordsMap={props.passwordsMap}
        rowsPerPage={rowsPerPage}
        pageNumber={pageNumber}
        indexesOfFoundResultsForCurrentPage={
          indexesOfFoundResultsForCurrentPage
        }
      />
    </>
  );
};

export default compose(
  withDataLoaderForMenu("Gov-ua", getDataByMenu), // 👈 ТЕ САМЕ, що у phones
  withToggleElements("Gov-ua")
)(GovUAPage);
