import React, { useEffect } from "react";
import s from "./MailsTable.module.css";

const MailsTable = ({
  fetchUrl,
  mailType,
  pageNumber,
  addMailsActionCreator,
  mailsData = [], 
  columns,
  title,
  handleTogglePasswords,
  showPasswords,
  passwordsMap,
  rowsPerPage
}) => {

  // Завантаження даних при зміні fetchUrl або функції додавання
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        addMailsActionCreator(mailType, data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [fetchUrl, addMailsActionCreator, mailType]);


  const pageData = mailsData?.[pageNumber - 1]?.rows || [];

  return (
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
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
            {showPasswords && <th>Пароль</th>}
          </tr>
        </thead>
        <tbody>
          {pageData.map((item, index) => (
            <tr key={item.id || index}>
              <td>{(pageNumber - 1) * rowsPerPage + index+1}</td>
              {columns.map(col => (
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
