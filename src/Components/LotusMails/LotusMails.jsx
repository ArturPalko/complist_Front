import { rowsPerPage, useState/*, compose */} from "../CommonInjection/Dependencies/ComponentImports";
import { getLotusMails, isLotusDataFetching, isLotusDataLoaded } from "../../redux/selectors/selector";
import { getMailsData } from "../../redux/mails-reducer";
import MailsTable from "../MalisTable/MailsTable";
import withDataLoader from "../../redux/hocs/withDataLoader";
import TopTableBar from "../TopTableBar/TopTableBar";
import withToggleElements from "../../redux/hocs/withToggleElements";
import { useEffect } from "../CommonInjection/Dependencies/ComponentImports";
import { useDataLoader, useIndexesForPage } from "../../redux/hooks/hooks";
import { compose } from "redux";
import { usePageNumber } from "../../redux/hooks/hooks";

const LotusPage = (props) => {

  const pageName = "Lotus"; 
  const indexesOfFoundResultsForCurrentPage = useIndexesForPage(pageName);


  return (
    <>
      <TopTableBar
        title="Поштові скриньки Lotus"
        mailType={pageName.toLocaleLowerCase()}
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
        pageNumber={usePageNumber()}
        indexesOfFoundResultsForCurrentPage={indexesOfFoundResultsForCurrentPage}
        
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
  withToggleElements("Lotus")
)(LotusPage);
