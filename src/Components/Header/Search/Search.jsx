import { connect } from "react-redux";
import { activeMenu, isPresentedSearchField, getGovUaMails, getLotusMails,getPhones } from "../../../redux/selectors/selector";
import { addFoundItems } from "../../../redux/toggledElements-reducer";
import { useState, useEffect } from "react";
import SearchForm from "./SearchForm/SearchForm";

const Search = (props) => {
  const activeMenuStr = props.activeMenu ? props.activeMenu.toLowerCase() : "";
  const [inputValue, setInputValue] = useState("");

  // Підставляємо значення із глобального стейту при зміні меню
  useEffect(() => {
    const initialValue = props.searchFieldValue ? props.searchFieldValue(activeMenuStr) : "";
    setInputValue(initialValue || "");
  }, [activeMenuStr, props.searchFieldValue]);

  const handleOnSearchButtonClick = (e) => {
    e.preventDefault();
    const searchValue = inputValue;
    console.log("Пошуковий запит:", searchValue);
    console.log("Ми шукаємо на сторінці:", activeMenuStr);

    let searchArea = [];
    let currentPage = 0;
    let index = 0;
    let foundResults = [];

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

    // Якщо є дані для пошуку
    if (searchArea.length) {
      searchArea.forEach((element) => {
        Object.keys(element).forEach((key) => {
          if (key === "rows" && Array.isArray(element[key])) {
            currentPage++;
            element[key].forEach((rowElement, rowIndex) => {
              index = rowIndex + 1;
              Object.entries(rowElement).forEach(([dataKey, dataValue]) => {
                if (String(dataValue).toLowerCase().includes(searchValue)) {
                  foundResults.push({ dataKey, dataValue, currentPage, index });
                }
              });
            });
          }
        });
      });
    }

    if (!foundResults.length) {
      console.log("Не знайдено результатів");
    }

    props.addFoundItems(activeMenuStr, searchValue, foundResults);
  };

  return (
    <SearchForm
      isPresentedSearchField={props.isPresentedSearchField}
      inputValue={inputValue}
      setInputValue={setInputValue}
      handleOnSearchButtonClick={handleOnSearchButtonClick}
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
});

const mapDispatchToProps = { addFoundItems };

export default connect(mapStateToProps, mapDispatchToProps)(Search);
