import React, { useEffect } from "react";
import s from "../MalisTable/MailsTable.module.css";



const PhonesTable = ({ fetchUrl, addPhonesActionCreator, phonesData, columns, title}) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        addPhonesActionCreator(data);  
        
      console.log("Fetched data type:", Array.isArray(data)); // перевіряємо чи це масив
      console.log("Fetched data content:", data);         
    

        

      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [fetchUrl, addPhonesActionCreator]);

  let rowNumber = 1;



  return (
    
    <div className={s.content}>
      <h2>{title}</h2>
      <table>
<thead>
  <tr>
    <th>№ п/п</th>
    {columns.map((col) =>
      col.label === "Телефони" ? (
        <th key={col.key}>
          <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th colSpan="3">Телефон</th>
              </tr>
              <tr>
                <th>Міський</th>
                <th>Внутрішній</th>
                <th>IP</th>
              </tr>
            </thead>
          </table>
        </th>
      ) : (
        <th key={col.key}>{col.label}</th>
      )
    )}
  </tr>
</thead>

    <tbody>
        {phonesData?.map((dept) => (
            <React.Fragment key={dept.departmentId}>
            {/* Рядок із назвою департаменту */}
            <tr>
                <td colSpan={3} style={{ fontWeight: "bold" }}>
                {dept.departmentName}
                </td>
            </tr>

            {/* Рядки користувачів */}
            {dept.users.map((user) => (
                <tr key={user.userId}>
                <td>{rowNumber++}</td>
                <td>{user.userPosition}</td>
                <td>{user.userName}</td>
                <td>{user.phones.map((p) => p.phoneName).join(", ")}</td>
                </tr>
            ))}
            </React.Fragment>
        ))}
</tbody>








            
      </table>
    </div>
  );
};

export default PhonesTable;
