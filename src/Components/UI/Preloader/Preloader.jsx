import spinner from "../../../assets/SVG/Spinner/Spinner.svg"
import s from '../Preloader/Preloader.module.css';


const Preloader = ({ count }) => {
    const showDescription = count < 8;

  return (
    <div className={s.preloader}>
      <img src={spinner} alt="loading..." />
      {showDescription && (  <div className={s.timer}>Запит даних:<div className={s.time}>{count < 10 ? count : ''}s</div></div>)}
    </div>
  );
};

export default Preloader;

