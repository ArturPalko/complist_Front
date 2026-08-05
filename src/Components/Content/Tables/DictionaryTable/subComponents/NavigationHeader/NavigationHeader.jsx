import s from "../../../PhonesTable/PhonesTable.module.css"

const NavigationHeader = ({
  totalColumns,
  departmentName,
  sectionName,
  showSection,
  onBack,
}) => {
  return (
    <tr>
      <th
        colSpan={totalColumns}
        className={s.navigationHeader}
      >
        <div className={s.navigationContent}>
          <button
            type="button"
            className={s.backButton}
            onClick={onBack}
          >
            ← Назад
          </button>

          <div className={s.navigationTitle}>
            <span className={s.departmentTitle}>
              {departmentName}
            </span>

            {showSection && (
              <>
                <span className={s.navigationSlash}>
                  {" / "}
                </span>

                <span className={s.sectionTitle}>
                  {sectionName}
                </span>
              </>
            )}
          </div>
        </div>
      </th>
    </tr>
  );
};

export default NavigationHeader;