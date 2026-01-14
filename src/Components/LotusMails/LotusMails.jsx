import React from "react";
import { compose } from "redux";
import MailsTable from "../MalisTable/MailsTable";
import TopTableBar from "../TopTableBar/TopTableBar";
import { rowsPerPage } from "../CommonInjection/Dependencies/ComponentImports";
import { useIndexesForPage, usePageNumber } from "../../redux/hooks/hooks";
import withToggleElements from "../../redux/hocs/withToggleElements";
import withDataLoaderForMenu from "../../redux/hocs/withDataLoader";
import { getMailsData } from "../../redux/mails-reducer";

const LotusPage = (props) => {
  const pageName = "Lotus"; 
  const indexesOfFoundResultsForCurrentPage = useIndexesForPage(pageName);
  const pageNumber = usePageNumber();

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
  // Використовуємо універсальний HOC
  withDataLoaderForMenu("Lotus", getMailsData),
  withToggleElements("Lotus")
)(LotusPage);
