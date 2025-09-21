import { usePageNumber, rowsPerPage, connect, useState, useEffect } from "../CommonInjection/Dependencies/ComponentImports";
import MailsTable from "../MalisTable/MailsTable";
import { getGovUaMails } from "../../redux/selectors/selector";
import { getMailsData } from "../../redux/mails-reducer";

const GovUAPage = (props) => {
    useEffect(() => {
      props.getMailsData("gov-ua"); 
      console.log("виконано запит за гов-юа")
    }, []);

    return(
        <MailsTable
            mailType="gov-ua"
            mailsData={props.mailsData}
            columns={[
              { key: "mailName", label: "найменування скриньки" },
              { key: "departmentOrSection", label: "найменування підрозділу" },
              { key: "usersName", label: "відповідальна особа" },
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
