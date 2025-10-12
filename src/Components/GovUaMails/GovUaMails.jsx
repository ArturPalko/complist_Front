import { usePageNumber, rowsPerPage, connect, useState, useEffect, withDataLoader,setDataIsLoadedActionCreator,compose} from "../CommonInjection/Dependencies/ComponentImports";
import MailsTable from "../MalisTable/MailsTable";
import { getGovUaMails, isGovUaDataFetching, isGovUaDataLoaded } from "../../redux/selectors/selector";
import { getMailsData } from "../../redux/mails-reducer";
import TopTableBar from "../TopTableBar/TopTableBar";
import withToggleElements from "../../redux/hocs/withToggleElements";

const GovUAPage = (props) => {

    return(
      <>
      <TopTableBar
      title="Поштові скриньки Gov-ua"
      mailType="gov-ua"
      valueOfSearchCheckBox={props.isPresentedSearchField}
      handleToggleSearchField={props.handleToggleSearchField} 
      />
        <MailsTable
            mailType="gov-ua"
            mailsData={props.data}
            columns={[
              { key: "mailName", label: "найменування скриньки" },
              { key: "departmentOrSection", label: "найменування підрозділу" },
              { key: "userName", label: "відповідальна особа" },
            ]}
            title="Поштові скриньки Вінницької митниці customs.gov.ua"
            rowsPerPage={rowsPerPage}
            pageNumber={usePageNumber()}
          />
      </>

          )

}
  
export default compose(
  withDataLoader(
  isGovUaDataLoaded,   
  isGovUaDataFetching,
  getGovUaMails,      
  getMailsData,          
  "gov-ua"),
  withToggleElements    
)(GovUAPage);
