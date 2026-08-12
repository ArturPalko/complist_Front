
import { forwardRef } from "react";
import s from "./SearchForm.module.css";
import cross from "../../../../assets/Img/cross.png";
import loupe from "../../../../assets/Img/loupe.png";

const SearchForm = forwardRef((props, ref) => {
  const {
    showNotFound,
    inputValue,
    setInputValue,
    isPresentedSearchField,
    handleOnSearchButtonClick,
    handleOnClearSearchFormButtonClick,
    getCountOfFoundResults,
    searchMode,
    onSearchModeChange
  } = props;

  if (!isPresentedSearchField) return null;

  const count = getCountOfFoundResults();

  return (
    <div
      className={s.searchBlock}
      onDragStart={(e) => e.preventDefault()}
    >
      <form className={s.form}>
        <input
          ref={ref}
          maxLength={36}
          className={`${s.searchInput} ${showNotFound ? s.shake : ""}`}
          placeholder="Ввести значення пошуку"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={showNotFound}
        />

        <img
          src={cross}
          onClick={handleOnClearSearchFormButtonClick}
          alt="clear"
        />

        <button
          className={s.searchButton}
          type="submit"
          onClick={handleOnSearchButtonClick}
        >
          Пошук
        </button>

        <div className={s.searchModeSwitcher}>
          <button
            type="button"
           className={`${s.searchModeButton} ${
    searchMode === "results" ? s.activeSearchMode : s.inactiveSearchMode
  }`}
            onClick={() => onSearchModeChange("results")}
          >
            Результати
          </button>

          <button
            type="button"
          className={`${s.searchModeButton} ${
    searchMode === "filter" ? s.activeSearchMode : s.inactiveSearchMode
  }`}
            onClick={() => onSearchModeChange("filter")}
          >
            Фільтр
          </button>
        </div>
      </form>

      {count > 0 && (
        <div className={s.resultsInfo}>
          <img src={loupe} alt="loupe" />
          <span className={s.searchInputSupportText}>
            Знайдено результатів: {count}
          </span>
        </div>
      )}
    </div>
  );
});



export default SearchForm;