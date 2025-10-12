import s from "./PhonesTable.module.css";
import Preloader from "../Preloader/Preloader"


const PhonesTable = ({ phonesData, isDataFetching, columns, pageNumber, rowsPerPage }) => {
  const pageData = phonesData?.[pageNumber - 1]?.rows || [];
  let indexDecrement = 0;
  const phoneColumns = columns.find((c) => c.key === "phones")?.subLabels.length || 0;

  return (   
     <div className={s.content}>
        <table>
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
            {pageData.map((row, index) => {
              switch (row.type) {
                case "department":
                  indexDecrement++;
                  return (
                    <tr key={`dep-${row.departmentId}`}>
                      <td className={s.mainDepartment} colSpan={columns.length + phoneColumns}>
                        {row.departmentName}
                      </td>
                    </tr>
                  );
                case "section":
                  indexDecrement++;
                  return (
                    <tr key={`sec-${row.sectionId}`}>
                      <td className={s.section} colSpan={columns.length + phoneColumns}>
                        {row.sectionName}
                      </td>
                    </tr>
                  );
                case "user":
                  return (
                    <tr key={`user-${row.userId}`}>
                      <td>{(pageNumber - 1) * rowsPerPage + index + 1 - indexDecrement}</td>
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
                        const phone = row.phones?.find(p => p.phoneType === sub.label);
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

  )
}


export default PhonesTable;
