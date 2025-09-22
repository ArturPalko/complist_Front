import { usePageNumber, rowsPerPage, connect, useState, useEffect, withDataLoader,setDataIsLoadedActionCreator} from "../CommonInjection/Dependencies/ComponentImports";
import MailsTable from "../MalisTable/MailsTable";
import { getGovUaMails, isGovUaDataFetching, isGovUaDataLoaded } from "../../redux/selectors/selector";
import { getMailsData } from "../../redux/mails-reducer";


const GovUAPage = (props) => {

    return(
        <MailsTable
            mailType="gov-ua"
            mailsData={props.data}
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
  
export default withDataLoader(
  isGovUaDataLoaded,   
  isGovUaDataFetching,
  getGovUaMails,      
  getMailsData,          
  "gov-ua"                    
)(GovUAPage);
