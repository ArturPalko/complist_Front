import { usePageNumber, rowsPerPage, useState, setDataIsLoadedActionCreator } from "../CommonInjection/Dependencies/ComponentImports";
import { getLotusMails, isLotusDataLoaded } from "../../redux/selectors/selector";
import { getMailsData } from "../../redux/mails-reducer";
import MailsTable from "../MalisTable/MailsTable";
import withDataLoader from "../../redux/hocs/withDataLoader";

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
    <MailsTable
      mailType="lotus"
      mailsData={props.data}
      isDataLoaded={props.isDataLoaded}
      columns={[
        { key: "previousName", label: "Стара назва скриньки" },
        { key: "name", label: "Нова назва скриньки" },
        { key: "owner", label: "Назва підрозділу" },
      ]}
      title="Поштові скриньки Lotus"
      handleTogglePasswords={handleTogglePasswords}
      showPasswords={showPasswords}
      passwordsMap={passwordsMap}
      rowsPerPage={rowsPerPage}
      pageNumber={usePageNumber()}
    />
  );
};


export default withDataLoader(
  isLotusDataLoaded,   
  getLotusMails,      
  getMailsData,              
  setDataIsLoadedActionCreator, 
  "lotus"                    
)(LotusPage);
