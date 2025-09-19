import { connect } from "react-redux";
import MailsTable from "../MalisTable/MailsTable";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getGovUaMails } from "../../redux/selectors/selector";
import { rowsPerPage } from "../../redux/selectors/selector";
import { getMailsData } from "../../redux/mails-reducer";
import { usePageNumber } from "../../redux/hooks/hooks";

const GovUAPage = ({ mailsData, getMailsData }) => {
    useEffect(() => {
      getMailsData("gov-ua"); 
      console.log("виконано запит за гов-юа")
    }, []);

    return(
        <MailsTable
            mailType="gov-ua"
            mailsData={mailsData}
            columns={[
              { key: "mailName", label: "найменування скриньки" },
              { key: "departmentOrSection", label: "найменування підрозділу" },
              { key: "userName", label: "відповідальна особа" },
            ]}
            title="Поштові скриньки Вінницької митниці customs.gov.ua"
            rowsPerPage={rowsPerPage}
            pageNumber={usePageNumber()}
          />
    )
  

}
  

const mapStateToProps = (state) => ({ mailsData: getGovUaMails(state) });
const mapDispatchToProps = { getMailsData };

export default connect(mapStateToProps, mapDispatchToProps)(GovUAPage);
