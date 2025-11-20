import { connect } from "react-redux";
import {
  activeMenu,
  isPresentedSearchField,
  getGovUaMails,
  getLotusMails,
  getPhones,
  getCountOfFoundResults,
  getCountOfPresentedElement,
  getDepartmentsAndSectionsPerPage
} from "../../../redux/selectors/selector";

import { addFoundItems, clearSearchForm, updateDraftValue } from "../../../redux/toggledElements-reducer";
import { useState, useRef, useEffect } from "react";
import SearchForm from "./SearchForm/SearchForm";

const Search = (props) => {
  const activeMenuStr = props.activeMenu ? props.activeMenu.toLowerCase() : "";
  const [showNotFound, setShowNotFound] = useState(false);
  const inputRef = useRef(null);

  // draft і search значення з Redux
  const draftValue = props.draftValue(activeMenuStr);
  const searchValue = props.searchFieldValue(activeMenuStr);

  // обчислюємо value інпуту
  const inputValue = showNotFound
    ? "Не знайдено"
    : draftValue !== ""
      ? draftValue
      : searchValue || "";

  // Фокус на інпут
  useEffect(() => {
    if (!showNotFound && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showNotFound, activeMenuStr]);

  const handleOnClearSearchFormButtonClick = () => {
    props.clearSearchForm(activeMenuStr);
  };

  const handleOnSearchButtonClick = (e) => {
    e.preventDefault();
    const searchValueTrimmed = draftValue.trim();
    if (searchValueTrimmed.length < 3) return;

    // Вибір області пошуку по активному меню
    let searchArea = [];
    switch (activeMenuStr) {
      case "gov-ua":
        searchArea = props.getGovUaMails;
        break;
      case "lotus":
        searchArea = props.getLotusMails;
        break;
      case "phones":
        searchArea = props.getPhones;
        break;
      default:
        searchArea = [];
    }

    const excludedSearchKeys = [
      "type", "userId", "userTypeId","userTypePriority",
      "userPositionPriority", "departmentId", "departmentPriority",
      "sectionId", "sectionPriority"
    ];

    const foundResults = [];

    // Пошук у вибраній області
    searchArea.forEach((element) => {
      if (!element || !element.rows) return;

      element.rows.forEach((rowElement, rowIndex) => {
        if (!rowElement) return;
        const index = rowIndex + 1;
        let foundInRow = false;

        for (const [dataKey, dataValue] of Object.entries(rowElement)) {
          if (!excludedSearchKeys.includes(dataKey) &&
              typeof dataValue === "string" &&
              dataValue.toLowerCase().includes(searchValueTrimmed.toLowerCase())) {
            foundResults.push({
              elementType: rowElement.type,
              dataKey,
              dataValue,
              currentPage: element.pageIndex,
              index
            });
            foundInRow = true;
            break;
          }
        }

        if (!foundInRow && Array.isArray(rowElement.phones)) {
          rowElement.phones.forEach((phoneObj) => {
            if (phoneObj?.phoneName &&
                phoneObj.phoneName.toLowerCase().includes(searchValueTrimmed.toLowerCase())) {
              foundResults.push({
                elementType: rowElement.type,
                dataKey: "phoneName",
                dataValue: phoneObj.phoneName,
                currentPage: element.pageIndex,
                index
              });
            }
          });
        }
      });
    });

    if (!foundResults.length) {
      setShowNotFound(true);
      setTimeout(() => setShowNotFound(false), 1000);
    }

    // Диспатч результатів у Redux
    props.addFoundItems(activeMenuStr, searchValueTrimmed, foundResults);
  };

  return (
    <SearchForm
      ref={inputRef}
      showNotFound={showNotFound}
      inputValue={inputValue}
      setInputValue={(value) => value != "" ? props.updateDraftValue(activeMenuStr, value):props.clearSearchForm(activeMenuStr)}
      isPresentedSearchField={props.isPresentedSearchField}
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
  getPhones: getPhones(state),
  searchFieldValue: (menu) => state.toggledElements.searchField[menu]?.searchValue || "",
  draftValue: (menu) => state.toggledElements.searchField[menu]?.draftValue || "",
  getCountOfFoundResults: (menu) => getCountOfFoundResults(state, menu),
  getCountOfPresentedElement: (menu) => getCountOfPresentedElement(state, menu),
  getDepartmentsAndSectionsPerPage: getDepartmentsAndSectionsPerPage(state)
});

const mapDispatchToProps = { addFoundItems, clearSearchForm, updateDraftValue };

export default connect(mapStateToProps, mapDispatchToProps)(Search);
