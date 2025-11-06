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
   state.toggledElements.searchField["gov-ua"]?.foundResults.length > 0;

export const isLotusSearchValueFounded = (state) => 
    state.toggledElements.searchField["lotus"]?.foundResults.length > 0;

export const isPhonesSearchValueFound = (state) => 
   state.toggledElements.searchField["phones"].foundResults.length > 0;


export const foundSearchValueOfPhonesPage = (state) => 
   state.toggledElements.searchField["phones"];

export const foundSearchValueOfLotusMailsPage = (state) => 
   state.toggledElements.searchField["lotus"];

export const foundSearchValueOfGovUaPage = (state) => 
   state.toggledElements.searchField["gov-ua"];


export const getPhonesPageIndexDataOfFoundResults = (state) => {
          const keysToKeep = ["currentPage", "index"];
         return (foundSearchValueOfPhonesPage(state).foundResults.map(result =>
                                    Object.fromEntries(
                                        Object.entries(result).filter(([key]) => keysToKeep.includes(key))
                                    )
                                  ));
  
}

export const getLotusMailsPageIndexDataOfFoundResults = (state) => {
          const keysToKeep = ["currentPage", "index"];
         return (foundSearchValueOfLotusMailsPage(state).foundResults.map(result =>
                                    Object.fromEntries(
                                        Object.entries(result).filter(([key]) => keysToKeep.includes(key))
                                    )
                                  ));
  
}

export const getGovUaMailsPageIndexDataOfFoundResults = (state) => {
          const keysToKeep = ["currentPage", "index"];
         return (foundSearchValueOfGovUaPage(state).foundResults.map(result =>
                                    Object.fromEntries(
                                        Object.entries(result).filter(([key]) => keysToKeep.includes(key))
                                    )
                                  ));
  
}

export const getCurrentPageNumberByKey = (key) => (state) => state.currentPageNumber[key];
export const getPageIndexDataOfFoundResultsByKey = (key) => (state) => {
  const keysToKeep = ["currentPage", "index"];
  const foundResults = state.toggledElements.searchField[key].foundResults || [];
  return foundResults.map(result =>
    Object.fromEntries(Object.entries(result).filter(([k]) => keysToKeep.includes(k)))
  );
};


// Селектор для будь-якої сторінки
export const getPageIndexDataOfFoundResultsByPage = (pageName) => (state) => {
  const keysToKeep = ["currentPage", "index"];
  
  // Визначаємо який foundSearchValue використовувати
  const foundSearchValueOfPage = state.toggledElements.searchField[pageName];

  // Якщо даних немає, повертаємо порожній масив
  if (!foundSearchValueOfPage || !foundSearchValueOfPage.foundResults) return [];

  // Фільтруємо тільки потрібні ключі
  return foundSearchValueOfPage.foundResults.map(result =>
    Object.fromEntries(
      Object.entries(result).filter(([key]) => keysToKeep.includes(key))
    )
  );
};


export const getPhonesCurrentPageNumber = (state) =>
  state.currentPageNumber.phones ;

export const getLotusMailsCurretPageNumber = (state) =>
  state.currentPageNumber.Lotus;

export const getGovMailsCurretPageNumber = (state) =>
  state.currentPageNumber["Gov-ua"];



export const isPagesNavbarLinkElementOnCurrentPagePressed = (state) =>
  state.toggledElements.pagesNavbarLinkElementOnCurrentPage.isPressed;

export const isPreviousPageWasFoundResult = (state)=>{
  let page = activeMenu(state);
  let baseLink;
  switch(page){
    case "Lotus":
          baseLink = "/mails/Lotus"
    break;
    case "Gov-ua":
          baseLink = "/mails/Gov-ua"
    break;
    case "phones":
        baseLink = "/phones"  
  }
  debugger;
  return state.currentPageNumber.previousLocation ==  `${baseLink}/foundResults`;

}
 



