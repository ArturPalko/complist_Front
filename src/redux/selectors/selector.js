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

export const isPresentedSearchField = (state) =>{
  return state.toggledElements.showSearchField.isActive ;
  
}

export const activeMenu = (state) => state.currentPageNumber.activeMenu;
export const searchFieldValue = (state, menu) => {
  return state.toggledElements.searchField[menu]?.searchValue || "";
};

export const isGovUaSearchValueFounded = (state) => 
 true;

export const isLotusSearchValueFounded = (state) => 
  Boolean(state.toggledElements["lotus"]?.foundResults);

export const isPhonesSearchValueFound = (state) => 
   state.toggledElements.searchField["phones"].foundResults.length > 0;


export const foundSearchValueOfPhonesPage = (state) => 
   state.toggledElements.searchField["phones"];

/*export const getPhonesPageIndexDataOfFoundResults = (state) => {
  const keysToKeep = ["currentPage", "index"];

  const mapped = foundSearchValueOfPhonesPage(state).foundResults.map(result =>
    Object.fromEntries(
      Object.entries(result).filter(([key]) => keysToKeep.includes(key))
    )
  );

  // Залишаємо тільки унікальні пари { currentPage, index }
  const unique = mapped.filter(
    (value, index, self) =>
      index === self.findIndex(
        t => t.currentPage === value.currentPage && t.index === value.index
      )
  );

  return unique;
};*/
export const getPhonesPageIndexDataOfFoundResults = (state) => {
          const keysToKeep = ["currentPage", "index"];
         return (foundSearchValueOfPhonesPage(state).foundResults.map(result =>
                                    Object.fromEntries(
                                        Object.entries(result).filter(([key]) => keysToKeep.includes(key))
                                    )
                                  ));
  
}


export const getPhonesCurrentPageNumber = (state) =>
  state.currentPageNumber.phones ;


export const isPagesNavbarLinkElementOnCurrentPagePressed = (state) =>
  state.toggledElements.pagesNavbarLinkElementOnCurrentPage.isPressed;

export const isPreviousPageWasFoundResult = (state)=>
  state.currentPageNumber.previousLocation == "/phones/foundResults";




