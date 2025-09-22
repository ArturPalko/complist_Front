import React from "react";
import s from "../LotusMails/LotusMails.module.css";
import "./MailsTable.css";
import Preloader from "../Preloader/Preloader";

const MailsTable = ({
  mailType,
  mailsData = [],
  isDataFetching,
  columns,
  title,
  handleTogglePasswords,
  showPasswords,
  passwordsMap,
  rowsPerPage,
  pageNumber
}) => {
  const pageData = mailsData?.[pageNumber - 1]?.rows || [];

  return isDataFetching ? (
    <Preloader />
  )  : (
    <div className={s.content}>
      <div className={s.headerPanel}>
        <h2>{title}</h2>

        {mailType === "lotus" && (
          <div className={s.switchWrapper}>
            <div>
              <label className={s.switch}>
                <input type="checkbox" onChange={handleTogglePasswords} />
                <span className={s.slider}></span>
              </label>
            </div>
            <div className={s.sliderDesc}>
              <span>Показати паролі</span>
            </div>
          </div>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>№ п/п</th>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {showPasswords && <th>Пароль</th>}
          </tr>
        </thead>
        <tbody>
          {pageData.map((item, index) => (
            <tr key={item.id || index}>
              <td>{(pageNumber - 1) * rowsPerPage + index + 1}</td>
              {columns.map((col) => (
                <td key={col.key}>{item[col.key]}</td>
              ))}
              {showPasswords && <td>{passwordsMap[item.id] || "—"}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default MailsTable;
