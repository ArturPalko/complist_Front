import { connect } from "react-redux";
import s from "./Search.module.css";
import { isPresentedSearchFieldOnLotus } from "../../../redux/selectors/selector";

const Search = (props) => {
  return <SearchForm isPresentedSearchFieldOnLotus={props.isPresentedSearchFieldOnLotus} />;
};

const SearchForm = ({ isPresentedSearchFieldOnLotus }) => {
  return (
    isPresentedSearchFieldOnLotus && (
      <form className={s.form}>
        <input className={s.searchInput} placeholder="Ввести значення пошуку" />
        <button className={s.searchButton} type="submit">Пошук</button>
      </form>
    )
  );
};

const mapStateToProps = (state) => ({
  isPresentedSearchFieldOnLotus: isPresentedSearchFieldOnLotus(state),
});

export default connect(mapStateToProps)(Search);
