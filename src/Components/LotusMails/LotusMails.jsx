import { connect } from "react-redux";
import MailsTable from "../MalisTable/MailsTable";
import { useState, useEffect} from "react";
import { getLotusMails } from "../../redux/selectors/selector";
import { getMailsData } from "../../redux/mails-reducer";
import { usePageNumber } from "../../redux/hooks/hooks";
import { rowsPerPage } from "../../redux/selectors/selector";

const LotusPage = ({ mailsData, getMailsData }) => {
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordsMap, setPasswordsMap] = useState({});


   useEffect(() => {
      getMailsData("lotus"); 
      console.log("виконано запит за лотус")
    }, []);


  const handleTogglePasswords = async (e) => {
    const checked = e.target.checked;
    setShowPasswords(checked);

    if (checked) {
      try {
        const response = await fetch(`http://localhost:5114/mails/Lotus/passwords`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json(); // [{email, password}, ...]

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
      mailsData={mailsData}
      columns={[
        { key: "previousName", label: "Стара назва скриньки" },
        { key: "name", label: "Нова назва скриньки" },
        { key: "owner", label: "Назва підрозділу" },
      ]}
      title="Поштові скриньки Вінницької митниці Lotus"
      handleTogglePasswords={handleTogglePasswords}
      showPasswords={showPasswords}
      passwordsMap={passwordsMap}
      rowsPerPage={rowsPerPage}
      pageNumber={usePageNumber()}
    />
  );
};

const mapStateToProps = (state) => ({ mailsData: getLotusMails(state) });
const mapDispatchToProps = { getMailsData };

export default connect(mapStateToProps, mapDispatchToProps)(LotusPage);

