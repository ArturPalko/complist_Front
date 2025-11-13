import { connect } from "react-redux";
import { activeMenu, isPresentedSearchField, getGovUaMails, getLotusMails,getPhones, getCountOfFoundResults,
  getCountOfPresentedElement,
  getDepartmentsAndSectionsPerPage
} from "../../../redux/selectors/selector";
import { addFoundItems, clearSearchForm } from "../../../redux/toggledElements-reducer";
import { useState, useEffect, useRef } from "react";
import SearchForm from "./SearchForm/SearchForm";

const Search = (props) => {
  const activeMenuStr = props.activeMenu ? props.activeMenu.toLowerCase() : "";
  const [inputValue, setInputValue] = useState("");
  const [showNotFound, setShowNotFound] = useState(false)
  const inputRef = useRef(null);

  useEffect(() => {
    const initialValue = props.searchFieldValue ? props.searchFieldValue(activeMenuStr) : "";
    setInputValue(initialValue || "");
  }, [activeMenuStr, props.searchFieldValue]);
  useEffect(() => {
    if (!showNotFound && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showNotFound]);
  const handleOnClearSearchFormButtonClick = () =>{
    props.clearSearchForm(props.activeMenu.toLowerCase());
    
  }

  const handleOnSearchButtonClick = (e) => {
    e.preventDefault();
    const searchValue = inputValue.trim();
    let b = props.getDepartmentsAndSectionsPerPage;
    let n = props.getCountOfPresentedElement(activeMenuStr);
    console.log ("n:", n)
    //debugger;
    console.log("Пошуковий запит:", searchValue);
    console.log("Ми шукаємо на сторінці:", activeMenuStr);

    let searchArea = [];
    let currentPage = 0;
    let index = 0;
    let foundResults = [];
    const excludedSearchKeys =["type", "userId", "userTypeId","userTypePriority",

    "userPositionPriority", "departmentId", "departmentPriority", "sectionId", "sectionPriority"
  ]

  
    switch(activeMenuStr) {
      case "gov-ua":
        searchArea = props.getGovUaMails;
        break;
      case "lotus":
        searchArea = props.getLotusMails;
        break;
      case "phones": searchArea = props.getPhones;
        break; 
      default:
        searchArea = [];
    }

if (searchArea.length) {
  console.log("Шукаємо тут+++++++++++++", searchArea);
  

  searchArea.forEach((element) => {
    if (!element || !element.rows) return;
        if (searchValue === ""|| searchValue.length < 3 ) return;


    element.rows.forEach((rowElement, rowIndex) => {

     
      if (!rowElement) return;

      const index = rowIndex + 1;
      let foundInRow = false;
     //debugger;
     for (const [dataKey,dataValue] of Object.entries(rowElement))  {
        if (
         !excludedSearchKeys.includes(dataKey)&&
          typeof dataValue === "string" &&
          dataValue.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          foundResults.push({elementType:rowElement.type, dataKey, dataValue, currentPage: element.pageIndex, index });
          //debugger;
          
          foundInRow = true;
          console.log(
            `Знайдено на верхньому рівні: сторінка ${element.pageIndex}, рядок ${index}, ${dataKey}: ${dataValue}`
          ); 

          break;
        
        }
      };

      if (!foundInRow && Array.isArray(rowElement.phones)) {
        rowElement.phones.forEach((phoneObj) => {
          if (
            phoneObj?.phoneName &&
            phoneObj.phoneName.toLowerCase().includes(searchValue.toLowerCase())
            
          ) {
            foundResults.push({
              elementType: rowElement.type,
              dataKey: "phoneName",
              dataValue: phoneObj.phoneName,
              currentPage: element.pageIndex,
              index
            });
            console.log(
              `Знайдено у phones: сторінка ${element.pageIndex}, рядок ${index}, значення: ${phoneObj.phoneName}`
            );
          }
        });
        
      }
    });
  });
}

if (!foundResults.length) {
  console.log("Не знайдено результатів");
  
}
if (!foundResults.length) {
      setShowNotFound(true);
      debugger;
      setTimeout(() => {
        setShowNotFound(false);
      }, 1000); 
    }


    props.addFoundItems(activeMenuStr, searchValue, foundResults);
  };

  return (
        <SearchForm
      ref={inputRef}
      isPresentedSearchField={props.isPresentedSearchField}
      showNotFound={showNotFound}
      inputValue={inputValue}
      setInputValue={setInputValue}
      handleOnSearchButtonClick={handleOnSearchButtonClick}
      handleOnClearSearchFormButtonClick={handleOnClearSearchFormButtonClick}
      getCountOfFoundResults={() => props.getCountOfFoundResults(activeMenuStr)}

    />

  );
};


const mapStateToProps = (state) => ({
  isPresentedSearchField: isPresentedSearchField(state),
  activeMenu: activeMenu(state),
  getGovUaMails: getGovUaMails(state),
  getLotusMails: getLotusMails(state),
  getPhones:getPhones(state),
  searchFieldValue: (menu) => state.toggledElements.searchField[menu]?.searchValue || "",
  getCountOfFoundResults: (menu) => getCountOfFoundResults(state, menu),
  getCountOfPresentedElement: (menu) => getCountOfPresentedElement(state, menu),
  getDepartmentsAndSectionsPerPage:getDepartmentsAndSectionsPerPage(state)
});

const mapDispatchToProps = { addFoundItems, clearSearchForm };

export default connect(mapStateToProps, mapDispatchToProps)(Search);