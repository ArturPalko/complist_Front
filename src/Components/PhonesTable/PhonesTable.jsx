import React, { useEffect, useRef } from "react";
import s from "./PhonesTable.module.css";

const PhonesTable = ({ fetchUrl, addPhonesActionCreator, phonesData, columns, title }) => {
  const rowNumber = useRef(1); // глобальний лічильник для всієї таблиці

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        addPhonesActionCreator(data);

        console.log("Fetched data type:", Array.isArray(data));
        console.log("Fetched data content:", data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [fetchUrl, addPhonesActionCreator]);

  const phoneColumns = columns.find((c) => c.key === "phones")?.subLabels.length || 0;
    if (phonesData) {
        rowNumber.current = 1;
      }


  return (

    <div className={s.content}>
      <h2>{title}</h2>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th rowSpan="2">№ п/п</th>
            {columns.map((col) =>
              col.key === "phones" ? (
                <th key={col.key} colSpan={col.subLabels.length}>
                  {col.label}
                </th>
              ) : (
                <th key={col.key} rowSpan="2">
                  {col.label}
                </th>
              )
            )}
          </tr>
          <tr>
            {columns
              .filter((col) => col.key === "phones")
              .flatMap((col) =>
                col.subLabels.map((phone) => <th key={phone.key}>{phone.label}</th>)
              )}
          </tr>
        </thead>

       <tbody>
         {phonesData[0]?.rows?.map((row) => {
              switch(row.type) {
                case "department":
                  return <tr key={`dep-${row.departmentId}`}><td className={s.mainDepartment} colSpan={columns.length + phoneColumns}>{row.departmentName}</td></tr>;
                case "section":
                  return <tr key={`sec-${row.sectionId}`}><td className={s.section} colSpan={columns.length + phoneColumns}>{row.sectionName}</td></tr>;
                case "user":
                  return (
                    <tr key={`user-${row.userId}`}>
                    <td>{rowNumber.current++}</td>

                    {row.userType !== 1 ? (
                      <>
                        <td>{row.userName}</td>
                        <td></td>
                      </>
                    ) : (
                      <>
                        <td>{row.userPosition}</td>
                        <td>{row.userName}</td>
                      </>
                    )}

                      {columns.find(c => c.key === "phones")?.subLabels.map(sub => {
                        const phone = row.phones?.find(p => p.phoneType === sub.label); // <=== тут
                        return <td key={sub.key}>{phone ? phone.phoneName : ""}</td>;
                      })}
                    </tr>
                  );
                default:
                  return null;
              }
            })}


        </tbody>


      </table>
    </div>
  );
};

export default PhonesTable;
