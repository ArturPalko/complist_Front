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

if (searchArea.length) {
  console.log("Шукаємо тут", searchArea);

  searchArea.forEach((element) => {
    if (!element || !element.rows) return;

    element.rows.forEach((rowElement, rowIndex) => {
      if (!rowElement) return;

      const index = rowIndex + 1;
      let foundInRow = false;

      Object.entries(rowElement).forEach(([dataKey, dataValue]) => {
        if (
          typeof dataValue === "string" &&
          dataValue.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          foundResults.push({ dataKey, dataValue, currentPage: element.pageIndex, index });
          foundInRow = true;
          console.log(
            `Знайдено на верхньому рівні: сторінка ${element.pageIndex}, рядок ${index}, ${dataKey}: ${dataValue}`
          );
        }
      });

      if (!foundInRow && Array.isArray(rowElement.phones)) {
        rowElement.phones.forEach((phoneObj) => {
          if (
            phoneObj?.phoneName &&
            phoneObj.phoneName.toLowerCase().includes(searchValue.toLowerCase())
          ) {
            foundResults.push({
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
