import { connect } from "react-redux";
import MailsTable from "../MalisTable/MailsTable";
import { addMailsActionCreator } from "../../redux/mails-reducer";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getGovUaMails } from "../../redux/selectors/selector";

const GovUAPage = ({ mailsData, addMailsActionCreator }) => {
    const params = useParams();
    const pageNumber = Number(params.pageNumber) || 1;
    const rowsPerPage = 18;
      useEffect(() => {
      console.log("Поточна сторінка змінилася:", pageNumber);
    }, [pageNumber]);

    return(
        <MailsTable
            fetchUrl="http://localhost:5114/mails/Gov-ua"
            mailType="gov-ua"
            pageNumber={pageNumber}
            addMailsActionCreator={addMailsActionCreator}
            mailsData={mailsData}
            columns={[
              { key: "mailName", label: "найменування скриньки" },
              { key: "departmentOrSection", label: "найменування підрозділу" },
              { key: "userName", label: "відповідальна особа" },
            ]}
            title="Поштові скриньки Вінницької митниці customs.gov.ua"
            rowsPerPage={rowsPerPage}
          />
    )
  

}
  

const mapStateToProps = (state) => ({ mailsData: getGovUaMails(state) });
const mapDispatchToProps = { addMailsActionCreator };

export default connect(mapStateToProps, mapDispatchToProps)(GovUAPage);
