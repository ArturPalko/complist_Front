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

export const isLotusDataLoaded = (state) =>{
        return state.dataState.lotus.dataIsLoaded
}

export const isGovUaDataLoaded = (state) =>{
        return state.dataState["gov-ua"].dataIsLoaded
}

export const isPhonesDataLoaded = (state) =>{
        return state.dataState.phones.dataIsLoaded
}

export const isLotusDataFetching = (state) => {
  return state.dataState.lotus.dataIsFetching;
};
export const isGovUaDataFetching = (state) => {
  return state.dataState["gov-ua"].dataIsFetching;
};
export const isPhonesDataFetching = (state) => {
  return state.dataState.phones.dataIsFetching;
};

export const isPresentedSearchFieldOnGovUA = (state) =>{
  return state.toggledElements.searchField["gov-ua"].isPresented
}

export const isPresentedSearchFieldOnLotus = (state) =>{
  return state.toggledElements.searchField.lotus.isPresented;
}

export const isPresentedSearchFieldOnPhones = (state) =>{
  return state.toggledElements.searchField.phones.isPresented
}

export const isCheckboxShowSearchField=(state)=>{

  return state.ckecboxesOfToggle.showSearchField.isActive;
}

