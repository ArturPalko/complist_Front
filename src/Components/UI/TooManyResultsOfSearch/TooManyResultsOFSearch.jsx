import peopleImg from "../../../assets/Img/people.png";
import s from "./TooManyResultsOfSearch.module.css";

const TooManyResultsOfSearch = () => {
  return (
    <div className={s.info}>
      <img
        className={s.infoImg}
        src={peopleImg}
        alt="Too many results"
      />

      <span className={s.description}>
        Забагато результатів пошуку
        <br />
        <u>
          <i>дивись на сторінках</i>
        </u>
        <br />
        <u>
          <i>або зміни тип пошуку на фільтр</i>
        </u>
      </span>
    </div>
  );
};

export default TooManyResultsOfSearch;
