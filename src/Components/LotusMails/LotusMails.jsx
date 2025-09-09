import { connect } from "react-redux";
import MailsTable from "../MalisTable/MailsTable";
import { addMailsActionCreator } from "../../redux/mails-reducer";

const LotusPage = ({ mailsData, addMailsActionCreator }) => (
  <MailsTable
    fetchUrl="http://localhost:5114/mails/Lotus"
    mailType="lotus"
    addMailsActionCreator={addMailsActionCreator}
    mailsData={mailsData}
    columns={[
      { key: "previousName", label: "Стара назва скриньки" },
      { key: "name", label: "Нова назва скриньки" },
      { key: "owner", label: "Назва підрозділу" },
    ]}
    title="Поштові скриньки Вінницької митниці Lotus"
  />
);

const mapStateToProps = (state) => ({ mailsData: state.mails.mails["lotus"] });
const mapDispatchToProps = { addMailsActionCreator };

export default connect(mapStateToProps, mapDispatchToProps)(LotusPage);
