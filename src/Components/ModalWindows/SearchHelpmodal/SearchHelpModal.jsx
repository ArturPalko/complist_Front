import s from "./SearchHelpModal.module.css";
import torn_pageImg from "../../../assets/Img/torn_page(big).png";
import searchModeToglerImg from "../../../assets/Img/serachModeTogler.png";

const SearchHelpModal = ({ onClose }) => {
  return (
    <div
      className={s.overlay}
      onClick={onClose}
    >
      <div
        className={s.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={s.close}
          onClick={onClose}
          aria-label="Закрити"
        >
          ×
        </button>

        <div className={s.header}>
          <div className={s.headerIcon}>?</div>

          <div>
            <h2>Як користуватись?</h2>
            <p>
              Коротко про можливості пошуку та фільтрації
            </p>
          </div>
        </div>

        <div className={s.content}>

          {/* РОЗРИВ СТОРІНКИ */}
          <div className={s.card}>
            <div className={s.cardIcon}>↪</div>

            <div className={s.cardContent}>
              <h3>Розрив сторінки</h3>

              <p>
                У меню <strong>«Телефони»</strong> підрозділ може
                продовжуватися на наступній сторінці.
              </p>

              <p>
                Позначка зліва на кольоровому рядку означає,
                що <strong>контакти цього підрозділу є також
                на наступній сторінці</strong>.
              </p>

              <p>
                Тому, якщо бачите таку позначку,
                <strong> перегорніть на наступну сторінку</strong>,
                щоб переглянути всі контакти підрозділу.
              </p>

              {/* МІСЦЕ ДЛЯ ЗОБРАЖЕННЯ */}
              <div className={s.imagePlaceholder}>
                <img
                  src={torn_pageImg}
                  alt="Приклад розриву сторінки"
                />
              </div>
            </div>
          </div>


          {/* РЕЖИМИ ПОШУКУ */}
          <div className={s.card}>
            <div className={s.cardIcon}>🔎</div>

            <div className={s.cardContent}>

              <div className={s.sectionTitle}>
                <h3>Режими пошуку</h3>

                {/* МІСЦЕ ДЛЯ ЗОБРАЖЕННЯ */}
                <div className={s.searchModesImage}>
                  <img
                    src={searchModeToglerImg}
                    alt="Перемикання режимів пошуку"
                  />
                </div>
              </div>

              <div className={s.searchModeBlock}>
                <h4>«Результати»</h4>

                <p>
                  Пошук знаходить усі сторінки, на яких
                  зустрічається потрібне значення.
                </p>

                <p>
                  На початку списку сторінок з'являється
                  спеціальна сторінка{" "}
                  <span className={s.rPage}>R</span>, де
                  зібрані всі знайдені результати.
                </p>

                <p>
                  Кожен результат на сторінці «R» містить
                  посилання на сторінку, де його було знайдено.
                </p>

                <p>
                  При переході на таку сторінку знайдене
                  значення буде{" "}
                  <span className={s.highlight}>
                    підсвічене
                  </span>{" "}
                  в таблиці.
                </p>

                <p>
                  Якщо{" "}
                  <span className={s.highlight}>
                    затиснути номер сторінки
                  </span>
                  , на ній також підсвітяться знайдені
                  значення.
                </p>
              </div>


              <div className={s.searchModeBlock}>
                <h4>«Фільтр»</h4>

                <p>
                  Цей режим пошуку залишає в таблиці лише ті
                  записи, які відповідають введеному значенню.
                </p>

                <p>
                  Використовуйте його, якщо потрібно швидко
                  звузити список записів за значенням пошуку.
                </p>
              </div>

            </div>
          </div>


          {/* ДОДАТКОВІ ФІЛЬТРИ */}
          <div className={s.card}>
            <div className={s.cardIcon}>⚙</div>

            <div className={s.cardContent}>
              <h3>Додаткові фільтри</h3>

              <p>
                Окрім режимів пошуку, у програмі є окремі
                фільтри для таблиці.
              </p>

              <p>
                <span className={s.highlight}>
                  Чорна кнопка
                </span>{" "}
                зліва під номерами сторінок — фільтр за
                властивостями записів.
              </p>

              <p>
                <span className={s.highlight}>
                  Червона кнопка
                </span>{" "}
                під таблицею — фільтр за підрозділами.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SearchHelpModal;

