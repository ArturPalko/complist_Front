import React, { useEffect } from "react";
import s from "./MailsTable.module.css";


const MailsTable = ({ fetchUrl, mailType, addMailsActionCreator, mailsData, columns, title}) => {
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
  }, [fetchUrl, addMailsActionCreator]);

  let rowNumber = 1;

  return (
    <div className={s.content}>
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>№ п/п</th>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mailsData?.map((item) => (
            <tr key={rowNumber}>
              <td>{rowNumber++}</td>
              {columns.map((col) => (
                <td key={col.key}>{item[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MailsTable;
