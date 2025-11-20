import { forwardRef } from "react";
import s from "./SearchForm.module.css";
import cross from "../../../../assets/cross.png";
import loupe from "../../../../assets/loupe.png";

const SearchForm = forwardRef((props, ref) => {
  const {
    showNotFound,
    inputValue,
    setInputValue,
    isPresentedSearchField,
    handleOnSearchButtonClick,
    handleOnClearSearchFormButtonClick,
    getCountOfFoundResults
  } = props;

  if (!isPresentedSearchField) return null;

  const count = getCountOfFoundResults(); 

  return (
    <div className={s.searchBlock}>
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
        <img src={cross} onClick={handleOnClearSearchFormButtonClick} alt="clear" />
        <button
          className={s.searchButton}
          type="submit"
          onClick={handleOnSearchButtonClick}
        >
          Пошук
        </button>
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
