import userEvent from "@testing-library/user-event";
import { selectUniqueCount,countMailData } from "./helpFunctions/countMailsData";
import { createSelector } from "@reduxjs/toolkit";
import { countPhoneData } from "./helpFunctions/countPhonesData";

export const rowsPerPage = 18;
export const foundSearchValueOfPhonesPage = (state) => 
   state.toggledElements.searchField["phones"];

export const foundSearchValueOfLotusMailsPage = (state) => 
   state.toggledElements.searchField["lotus"];

export const foundSearchValueOfGovUaPage = (state) => 
   state.toggledElements.searchField["gov-ua"];

const createCurrentPageSelector = ({
  key,
  foundSelector,
  hasFilter = false,
}) => (state) => {
  const pageState = state.currentPageNumber[key];
  const foundResults = foundSelector(state)?.foundResults ?? [];
  const isFilterApplied = hasFilter
    ? isFilterAppliedSelector(key)(state)
    : false;

  if (
    pageState.lastVisitedPage === "foundResults" &&
    foundResults.length > 0
  ) {
    return isFilterApplied
      ? pageState.filterPage
      : pageState.digitPage;
  }

  if (typeof pageState.lastVisitedPage === "number") {
    return pageState.lastVisitedPage;
  }

  return pageState.digitPage;
};

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
  
// ===== конкретні селектори =====
export const phonesCurrentPage = createCurrentPageSelector({
  key: "phones",
  foundSelector: foundSearchValueOfPhonesPage,
  hasFilter: true,
});

export const lotusCurrentPage = createCurrentPageSelector({
  key: "Lotus",
  foundSelector: foundSearchValueOfLotusMailsPage,
});

export const GovUaCurrentPage = createCurrentPageSelector({
  key: "Gov-ua",
  foundSelector: foundSearchValueOfGovUaPage,
});

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
export const isPresentedFielterPanel = (state) =>{
  return state.toggledElements.showFilterPanel.isActive ;
  
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

export const getCurrentPageNumberByKey = (key) => (state) => state.currentPageNumber[key].lastVisitedPage;
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
  

// //////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
// кешовані селектори для кожного меню
export const getPhonesCount = createSelector([getPhones], countPhoneData);
export const getLotusCount = createSelector([getLotusMails], countMailData);
export const getGovUaCount = createSelector([getGovUaMails], countMailData);

// основний селектор з кешуванням для активного меню
export const getCountsForActiveMenu = createSelector(
  [activeMenu, getPhonesCount, getLotusCount, getGovUaCount],
  (menu, phonesCount, lotusCount, govUaCount) => {
    switch (menu.toLowerCase()) {
      case 'phones': return phonesCount;
      case 'lotus': return lotusCount;
      case 'gov-ua': return govUaCount;
      default: return {};
    }
  }
);



export const getDepartmentsAndSectionsPerPage = (state,activeMenu) => {
  let data =[];
  if(activeMenu!=="phones") return [];
  if(isFilterAppliedSelector(activeMenu)(state)){
    data = getIndexesOfFiltredResults(state, activeMenu);
  }
  else{
     data = getPhones(state) || [];
  }
  

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
  return a
};

export const isFilterAppliedSelector = (menu) => (state) =>
  state.filters?.[menu]?.isFilterApplied ?? false;

export const getCurentFilterPage = (state, activeMenu) =>
  state.currentPageNumber?.[activeMenu]?.filterPage ?? 1;

export const getPositionsAndTypesOfUsers = (state) => {
  const contactTypes = [];
  const userPositions = [];
  const data = getPhones(state);

  if (!Array.isArray(data) || data.length === 0) {
    return { contactTypes: [], userPositions: [] };
  }

  data.forEach(element => {
    if (!Array.isArray(element.rows)) return;

    element.rows.forEach(row => {
      if (row.type === "user") {
        if (!contactTypes.includes(row.userType)) {
          contactTypes.push(row.userType);
        }

        if (row.userType === "Користувач") {
          if (!userPositions.includes(row.userPosition)) {
            if (row.userPosition === undefined) console.log("Пустий рядок:", row);
            userPositions.push(row.userPosition);
          }
        }
      }
    });
  });

  return { contactTypes, userPositions };
};



export const getSubFilters = (state) =>
  state.filters.phones?.usedFilters.subFilters ?? [];

// selector.js
export const isCurrentPageFoundResult = (menu) => (state) =>
  state.currentPageNumber?.[menu]?.lastVisitedPage === "foundResults";


export const getLastVisitedPage = (state,menu) =>
  state.currentPageNumber?.[menu]?.lastVisitedPage || 1;




