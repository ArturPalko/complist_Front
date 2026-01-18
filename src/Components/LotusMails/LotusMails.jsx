import React from "react";
import { compose } from "redux";
import MailsTable from "../MalisTable/MailsTable";
import TopTableBar from "../TopTableBar/TopTableBar";
import { rowsPerPage } from "../CommonInjection/Dependencies/ComponentImports";
import { useIndexesForPage, usePageNumber } from "../../redux/hooks/hooks";
import withToggleElements from "../../redux/hocs/withToggleElements";
import withDataLoaderForMenu from "../../redux/hocs/withDataLoader";
import { getMailsData } from "../../redux/mails-reducer";



import { getDataByMenu } from "../../redux/data-reducer"; // 👈 універсальний thunk

const LotusPage = (props) => {
  const pageName = "Lotus"; 
  const pageNumber = usePageNumber();
  const indexesOfFoundResultsForCurrentPage = useIndexesForPage(pageName);

  return (
    <>
      <TopTableBar
        title="Поштові скриньки Lotus"
        mailType={pageName}
      />
      <MailsTable
        mailType={pageName}
        columns={[
          { key: "previousName", label: "Стара назва скриньки" },
          { key: "name", label: "Нова назва скриньки" },
          { key: "owner", label: "Назва підрозділу" },
        ]}
        showPasswords={props.showPasswords}
        passwordsMap={props.passwordsMap}
        rowsPerPage={rowsPerPage}
        pageNumber={pageNumber}
        indexesOfFoundResultsForCurrentPage={indexesOfFoundResultsForCurrentPage}
      />
    </>
  );
};

export default compose(
  withDataLoaderForMenu("Lotus", getDataByMenu), // 👈 новий thunk
  withToggleElements("Lotus")
)(LotusPage);
