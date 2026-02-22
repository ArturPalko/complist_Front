import people from "../../../assets/Img/people.png"
import s from "./TooManyResultsOfSearch.module.css";

const TooManyResultsOfSearch = (props) => {
  return (
    <div className={s.info}>
      <img className={s.infoImg}src={people} alt="Too many results" />
        <span className={s.description}>Забагато результатів пошуку<br />
         <u><i>дивись на сторінках</i></u></span>
    </div>
  );
};

export default TooManyResultsOfSearch;
