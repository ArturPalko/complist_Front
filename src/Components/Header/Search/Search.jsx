import { connect } from "react-redux";
import s from "./Search.module.css";
import { isPresentedSearchField } from "../../../redux/selectors/selector";

const Search = (props) => {
  return <SearchForm isPresentedSearchField={props.isPresentedSearchField} />;
};

const SearchForm = (props) => {
  console.log("в поушуку")
  return (
    props.isPresentedSearchField && (
      <form className={s.form}>
        <input className={s.searchInput} placeholder="Ввести значення пошуку" />
        <button className={s.searchButton} type="submit">Пошук</button>
      </form>
    )
  );
};

const mapStateToProps = (state) => ({
  isPresentedSearchField: isPresentedSearchField(state),
});

export default connect(mapStateToProps)(Search);
