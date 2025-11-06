import { usePageNumber, rowsPerPage, useState, compose } from "../CommonInjection/Dependencies/ComponentImports";
import { getLotusMails, isLotusDataFetching, isLotusDataLoaded } from "../../redux/selectors/selector";
import { getMailsData } from "../../redux/mails-reducer";
import MailsTable from "../MalisTable/MailsTable";
import withDataLoader from "../../redux/hocs/withDataLoader";
import TopTableBar from "../TopTableBar/TopTableBar";
import withToggleElements from "../../redux/hocs/withToggleElements";
import { useEffect } from "../CommonInjection/Dependencies/ComponentImports";
import { useIndexesForPage } from "../../redux/hooks/hooks";

const LotusPage = (props) => {
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordsMap, setPasswordsMap] = useState({});

  const handleTogglePasswords = async (e) => {
    const checked = e.target.checked;
    setShowPasswords(checked);
    props.togglePasswords(checked,setPasswordsMap);}

      const pageName = "Lotus"; 
      const indexesOfFoundResultsForCurrentPage = useIndexesForPage(pageName);



  return (
    <>
      <TopTableBar
        title="Поштові скриньки Lotus"
        mailType="lotus"
        valueOfSearchCheckBox={props.isPresentedSearchField}
        handleToggleSearchField={props.handleToggleSearchField} 
        handleTogglePasswords={handleTogglePasswords}
      />
      <MailsTable
        mailType="Lotus"
        foundResults = {props.foundResults}
        mailsData={props.data}
        isDataFetching={props.isDataFetching}
        columns={[
          { key: "previousName", label: "Стара назва скриньки" },
          { key: "name", label: "Нова назва скриньки" },
          { key: "owner", label: "Назва підрозділу" },
        ]}
        showPasswords={showPasswords}
        passwordsMap={passwordsMap}
        rowsPerPage={rowsPerPage}
        pageNumber={usePageNumber()}
        indexDataOfFoundResultsForFoundResultsPage={props.indexDataOfFoundResultsForFoundResultsPage}
        indexesOfFoundResultsForCurrentPage={indexesOfFoundResultsForCurrentPage}
        isPreviousPageWasFoundResult={props.isPreviousPageWasFoundResult}
        isPagesNavbarLinkElementOnCurrentPagePressed={props.isPagesNavbarLinkElementOnCurrentPagePressed}
      />
    </>
  );
};

export default compose(
  withDataLoader(
    isLotusDataLoaded,
    isLotusDataFetching,
    getLotusMails,
    getMailsData,
    "lotus"
  ),
  withToggleElements
)(LotusPage);
