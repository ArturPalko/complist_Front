import { connect } from "react-redux";
import MailsTable from "../MalisTable/MailsTable";
import { addMailsActionCreator } from "../../redux/mails-reducer";

const GovUAPage = ({ mailsData, addMailsActionCreator }) => (
  <MailsTable
    fetchUrl="http://localhost:5114/mails/Gov-ua"
    mailType="gov-ua"
    addMailsActionCreator={addMailsActionCreator}
    mailsData={mailsData}
    columns={[
      { key: "mailName", label: "найменування скриньки" },
      { key: "departmentOrSection", label: "найменування підрозділу" },
      { key: "userName", label: "відповідальна особа" },
    ]}
    title="Поштові скриньки Вінницької митниці customs.gov.ua"
  />
);

const mapStateToProps = (state) => ({ mailsData: state.mails.mails["gov-ua"] });
const mapDispatchToProps = { addMailsActionCreator };

export default connect(mapStateToProps, mapDispatchToProps)(GovUAPage);
