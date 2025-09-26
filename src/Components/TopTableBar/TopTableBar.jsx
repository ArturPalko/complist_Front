import s from "./TopTableBar.module.css";

const TopTableBar = (props) => {
  const { title, mailType, valueOfSearchCheckBox,rememberCkeckboxState, handleToggleSearchField, handleTogglePasswords } = props;

  return (
    <div className={s.headerPanel}>
      <h2>{title}</h2>
      <div className={s.buttonsBar}>
          <div className={s.switchWrapper}>
                  <div>
                    <label className={s.switch}>
                      <input
                          type="checkbox"
                          id="showPasswords"
                          checked= {valueOfSearchCheckBox}
                          onChange={() => {
                            handleToggleSearchField();
                            rememberCkeckboxState();
                          }}
                        />

                      <span className={`${s.slider} ${s.blue}`}></span>
                    </label>
                  </div>
                  <div className={s.sliderDesc}>
                    <span>Показати пошук</span>
                  </div>
                </div>

                {mailType === "lotus" && (
                  <div className={s.switchWrapper}>
                    <div>
                      <label className={s.switch}>
                        <input type="checkbox" id="showSearch" onChange={handleTogglePasswords} />
                        <span className={`${s.slider} ${s.green}`}></span>
                      </label>
                    </div>
                    <div className={s.sliderDesc}>
                      <span>Показати паролі</span>
                    </div>
                  </div>
                )}
          </div>
      </div>
        );
      };

export default TopTableBar;
