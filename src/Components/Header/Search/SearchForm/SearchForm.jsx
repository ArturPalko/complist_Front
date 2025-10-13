import s from "./SearchForm.module.css";
import cross from "../../../../assets/cross.png";

const SearchForm = ({ inputValue, setInputValue, handleOnSearchButtonClick, isPresentedSearchField }) => {
  if (!isPresentedSearchField) return null;

  return (
    <form className={s.form}>
      <input
        className={s.searchInput}
        placeholder="Ввести значення пошуку"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <img src={cross}/>
      <button className={s.searchButton} type="submit" onClick={handleOnSearchButtonClick}>
        Пошук
      </button>
    </form>
  );
};

export default SearchForm;