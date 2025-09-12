import React, { useEffect } from "react";
import s from "../MalisTable/MailsTable.module.css";

const PhonesTable = ({ fetchUrl, addPhonesActionCreator, phonesData, columns, title }) => {
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

  let rowNumber = 1;
  const phoneColumns = columns.find((c) => c.key === "phones")?.subLabels.length || 0;

  return (
    <div className={s.content}>
      <h2>{title}</h2>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th rowSpan="2">№ п/п</th>
            {columns.map((col) =>
              col.key === "phones" ? (
                <th key={col.key} data-key={col.key} colSpan={col.subLabels.length}>
                  {col.label}
                </th>
              ) : (
                <th key={col.key} data-key={col.key} rowSpan="2">
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
          {phonesData?.map((dept) => (
            <React.Fragment key={dept.departmentId}>
              {/* Рядок із назвою департаменту */}
              <tr>
                <td colSpan={3 + phoneColumns} style={{ fontWeight: "bold" }}>
                  {dept.departmentName}
                </td>
              </tr>

              {/* Рядки користувачів департаменту */}
              {dept.users.map((user) => (
                <tr key={user.userId}>
                  <td>{rowNumber++}</td>
                  <td>{user.userPosition}</td>
                  <td>{user.userName}</td>
                  {columns.find((c) => c.key === "phones")?.subLabels.map((sub) => {
                    const phone = user.phones.find((p) => p.phoneType === sub.label);
                    return <td key={sub.key}>{phone ? phone.phoneName : ""}</td>;
                  })}
                </tr>
              ))}

              {/* Рядки секцій */}
              {dept.sections?.map((section) => (
                <React.Fragment key={section.id}>
                  {/* Рядок секції */}
                  <tr>
                    <td colSpan={3 + phoneColumns} style={{ fontWeight: "bold" }}>
                      {section.sectionName}
                    </td>
                  </tr>

                  {/* Користувачі секції */}
                  {section.users.map((user) => (
                    <tr key={user.userId}>
                      <td>{rowNumber++}</td>
                      <td>{user.userPosition}</td>
                      <td>{user.userName}</td>
                      {columns.find((c) => c.key === "phones")?.subLabels.map((sub) => {
                        const phone = user.phones.find((p) => p.phoneType === sub.label);
                        return <td key={sub.key}>{phone ? phone.phoneName : ""}</td>;
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PhonesTable;
