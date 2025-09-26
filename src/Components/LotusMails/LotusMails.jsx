import { usePageNumber, rowsPerPage, useState, setDataIsLoadedActionCreator } from "../CommonInjection/Dependencies/ComponentImports";
import { getLotusMails, isLotusDataFetching, isLotusDataLoaded, isCheckboxShowSearchField } from "../../redux/selectors/selector";
import { getMailsData } from "../../redux/mails-reducer";
import MailsTable from "../MalisTable/MailsTable";
import withDataLoader from "../../redux/hocs/withDataLoader";
import TopTableBar from "../TopTableBar/TopTableBar";

const LotusPage = (props) => {
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordsMap, setPasswordsMap] = useState({});

  const handleTogglePasswords = async (e) => {
    const checked = e.target.checked;
    setShowPasswords(checked);

    if (checked) {
      try {
        const response = await fetch(`http://localhost:5114/mails/Lotus/passwords`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const map = {};
        data.forEach(item => {
          map[item.id] = item.password;
        });
        setPasswordsMap(map);

      } catch (error) {
        console.error("Fetch passwords error:", error);
      }
    }
  };

  return (
    <>
      <TopTableBar
      title="Поштові скриньки Lotus"
      mailType="lotus"
      valueOfSearchCheckBox = {props.isCheckboxShowSearchField}
      rememberCkeckboxState = {() => props.rememberCkeckboxState("showSearchField")}
      handleToggleSearchField={() => props.handleToggleSearchField("lotus")}
      handleTogglePasswords={handleTogglePasswords}
      />
      <MailsTable
        mailType="lotus"
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
      />
    </>
  );

};


export default withDataLoader(
  isLotusDataLoaded,
  isLotusDataFetching, 
  //isCheckboxShowSearchField,  
  getLotusMails,      
  getMailsData,           
    "lotus"                    
)(LotusPage);
