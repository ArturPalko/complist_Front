export const rowsPerPage = 18;

export const getLotusMails = (state) => {
    return state.mails.lotus 
}

export const getGovUaMails = (state) => {
    return state.mails["gov-ua"] 
}

export const getPhones = (state) => {
    return state.phones.pages
}

export const phonesCount = (state) => {
    return state.phones?.pages?.length || 0
  }
 export const lotusCount = (state) => {
    return state.mails?.lotus?.length || 0
  }
 export const govUaCount = (state) =>{
    return state.mails?.["gov-ua"]?.length || 0;
  } 
  
export const GovUaCurrentPage = (state) => state.currentPageNumber["Gov-ua"];
export const lotusCurrentPage = (state) => state.currentPageNumber.Lotus;
export const phonesCurrentPage = (state) => state.currentPageNumber.phones;



