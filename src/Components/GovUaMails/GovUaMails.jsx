import {  rowsPerPage, connect, useState, useEffect, withDataLoader,setDataIsLoadedActionCreator,compose} from "../CommonInjection/Dependencies/ComponentImports";
import MailsTable from "../MalisTable/MailsTable";
import { getGovUaMails, isGovUaDataFetching, isGovUaDataLoaded } from "../../redux/selectors/selector";
import { getMailsData } from "../../redux/mails-reducer";
import TopTableBar from "../TopTableBar/TopTableBar";
import withToggleElements from "../../redux/hocs/withToggleElements";
import { useIndexesForPage } from "../../redux/hooks/hooks";
import { usePageNumber } from "../../redux/hooks/hooks";



const GovUAPage = (props) => {
  const pageName = "Gov-ua";
  const indexesOfFoundResultsForCurrentPage = useIndexesForPage(pageName);

  return (
    <>
      <TopTableBar
        title="Поштові скриньки Вінницької митниці customs.gov.ua"
        mailType={pageName.toLocaleLowerCase()}
      />
      <MailsTable
        mailType={pageName}
        columns={[
          { key: "mailName", label: "найменування скриньки" },
          { key: "departmentOrSection", label: "найменування підрозділу" },
          { key: "responsibleUser", label: "відповідальна особа" },
        ]}
        showPasswords={props.showPasswords}        // береться з HOC
        passwordsMap={props.passwordsMap}          // береться з HOC
        rowsPerPage={rowsPerPage}
        pageNumber={usePageNumber()}
        indexesOfFoundResultsForCurrentPage={indexesOfFoundResultsForCurrentPage}
      />
    </>
  );
};

export default compose(
  withDataLoader(
    isGovUaDataLoaded,
    isGovUaDataFetching,
    getGovUaMails,
    getMailsData,
    "gov-ua"
  ),
  withToggleElements("Gov-ua")   // параметризований HOC
)(GovUAPage);
