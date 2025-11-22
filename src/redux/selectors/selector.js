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
  
export const GovUaCurrentPage = (state) => {
  let found = foundSearchValueOfGovUaPage(state)?.foundResults;
  if(state.currentPageNumber["Gov-ua"].lastVisitedPage == "foundResults" && (found==undefined || found.length==0)){
    return state.currentPageNumber["Gov-ua"].digitPage
  }
   return state.currentPageNumber["Gov-ua"].lastVisitedPage
  }
export const lotusCurrentPage = (state) =>{
 let found = foundSearchValueOfLotusMailsPage(state)?.foundResults;
  if (state.currentPageNumber.Lotus.lastVisitedPage == "foundResults" && (found==undefined || found.length==0)){
     return state.currentPageNumber.Lotus.digitPage;
  }
  return state.currentPageNumber.Lotus.lastVisitedPage;} 
export const phonesCurrentPage = (state) => {
   let found = foundSearchValueOfPhonesPage(state)?.foundResults;
   if (state.currentPageNumber.phones.lastVisitedPage == "foundResults" && (found==undefined || found.length==0)){
     return state.currentPageNumber.phones.digitPage;
  }
  return state.currentPageNumber.phones.lastVisitedPage;
}

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

export const getCurrentPageNumberByKey = (key) => (state) => state.currentPageNumber[key].digitPage;
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
  
  return state.currentPageNumber.previousLocation ==  `${baseLink}/foundResults`;

}



export const getCountOfFoundResults = (state, typeOfPage) =>{
  let results= state.toggledElements?.searchField?.[typeOfPage]?.foundResults;
  if(typeOfPage == "phones"){
    let count =0;
    results.forEach(resultElement => {
    if(resultElement.elementType =="user"){
      count++;
    }    
   });
   return count;
  }
 return results.length ?? 0;
}
  

export const getCountOfPresentedElement = (state, activeMenu) => { 
  let internalPhonesSelector = [];
  let ciscoPhonesSelector = [];
  let landLinePhonesSelector = [];

  let countOfDepartments = 0;
  let countOfSections = 0;
  let countOfUsers = 0;
  let countOfMails = 0;

  let personalMails = 0;
  let departmentMails = 0;
  let sectionMails = 0;

  let hasNewPostName = 0;
  let passwordKnown = 0;
  let hasResponsibleUser = 0;


  const selectUniqueCount = (value) => {
    const unique = new Set(value.map(obj => `${obj.phoneType}-${obj.phoneName}`));
    return unique.size;
  };

  const countMailData = (data) => {
    data.forEach(element => {
      countOfMails += element.rows.length;
      element.rows.forEach(row => {
        if (row.name != null) hasNewPostName++;
        if (row.passwordKnown != null) passwordKnown++;
        if (row.responsibleUser) hasResponsibleUser++;

        switch (row.ownerType) {
          case "User":
            personalMails++;
            break;
          case "Department":
            departmentMails++;
            break;
          case "Section":
            sectionMails++;
            break;
        }
      });
    });
  };

  switch(activeMenu) {
    case "phones": {
      const data = getPhones(state) || [];
      data.forEach(element => {
        element.rows.forEach(row => {
          if (!row.type) return;
          switch(row.type) {
            case "department":
              countOfDepartments++;
              break;
            case "section":
              countOfSections++;
              break;
            case "user":
              countOfUsers++;
              row.phones?.forEach(phone => {
                switch(phone.phoneType) {
                  case "Внутрішній": internalPhonesSelector.push(phone); break;
                  case "Міський": landLinePhonesSelector.push(phone); break;
                  case "IP (Cisco)": ciscoPhonesSelector.push(phone); break;
                }
              });
              break;
          }
        });
      });
      break;
    }

    case "gov-ua": {
      const data = getGovUaMails(state) || [];
      countMailData(data);
      break;
    }

    case "lotus": {
      const data = getLotusMails(state) || [];
      countMailData(data);
      break;
    }

    default:
      break;
  }

  return { 
    countOfDepartments,
    countOfSections,
    countOfUsers,
    countOfMails,
    countOfLandlinePhones: selectUniqueCount(landLinePhonesSelector),
    countOfCiscoPhones: selectUniqueCount(ciscoPhonesSelector),
    countOfInternalPhones: selectUniqueCount(internalPhonesSelector),
    personalMails,
    departmentMails,
    sectionMails,
    hasNewPostName,
    passwordKnown,
    hasResponsibleUser
  };
};



export const getDepartmentsAndSectionsPerPage = (state,activeMenu) => {
  if(activeMenu!=="phones") return [];
  const data = getPhones(state) || [];

  return data.map(page => {
    let count = 0;
    page.rows.forEach(row => {
      if (row.type === "department" || row.type === "section") {
        count++;
      }
    });
    return count;
  });
};


export const getFilteredState = (state, activeMenu) => {
  return state.filters?.[activeMenu]?.usedFilters || {};
};

export const getIndexesOfFiltredResults = (state, activeMenu) => {
  return state.filters?.[activeMenu]?.filtredResults || [];
};


export const getCountOfPageForFiltredResults = (state, activeMenu) => {
  let a =  state.filters?.[activeMenu]?.filtredResults.length || [];
  console.log("Це э АААА",a)
  return a
};