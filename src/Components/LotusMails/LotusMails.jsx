import { connect } from "react-redux";
import MailsTable from "../MalisTable/MailsTable";
import { addMailsActionCreator } from "../../redux/mails-reducer";
import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { getLotusMails } from "../../redux/selectors/selector";

const LotusPage = ({ mailsData, addMailsActionCreator }) => {
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordsMap, setPasswordsMap] = useState({});
  const params = useParams();
  const pageNumber = Number(params.pageNumber) || 1;
  const rowsPerPage = 18;
    useEffect(() => {
    console.log("Поточна сторінка змінилася:", pageNumber);
  }, [pageNumber]);

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
      fetchUrl="http://localhost:5114/mails/Lotus"
      mailType="lotus"
      pageNumber={pageNumber}
      addMailsActionCreator={addMailsActionCreator}
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
    />
  );
};

const mapStateToProps = (state) => ({ mailsData: getLotusMails(state) });
const mapDispatchToProps = { addMailsActionCreator };

export default connect(mapStateToProps, mapDispatchToProps)(LotusPage);

