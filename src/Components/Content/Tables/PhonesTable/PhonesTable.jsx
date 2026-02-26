import s from "./PhonesTable.module.css";
import { useSelector } from "react-redux";
import { usePhonesTableLogic } from "../../../../redux/hooks/usePhonesTableLogic";
import { createTableComponent } from "../../../../shared/components/table/TableWrapper/tableFactory";
import { countNonUserRowsBefore, getUserRowIndex } from "./phonesTableHelpers";
import torn_pageImg from "../../../../assets/Img/torn_page.png";
import { selectDashedBlocks } from "../../../../redux/selectors/selector";

const BasePhonesTable = createTableComponent(usePhonesTableLogic);

const PhonesTable = ({ columns, pageNumber, rowsPerPage }) => {

  const dashedBlocks = useSelector(selectDashedBlocks);

  const renderHeader = () => (
    <>
      <tr>
        <th rowSpan="2">№ п/п</th>
        {columns.map((col) =>
          col.key === "phones" ? (
            <th key={col.key} colSpan={col.subLabels.length}>{col.label}</th>
          ) : (
            <th key={col.key} rowSpan="2">{col.label}</th>
          )
        )}
      </tr>
      <tr>
        {columns
          .filter(c => c.key === "phones")
          .flatMap(col => col.subLabels.map(sub => <th key={sub.key}>{sub.label}</th>))}
      </tr>
    </>
  );

  const renderRowCells = (row, index, tableLogic) => {
    const nonUserRowsBefore = countNonUserRowsBefore(tableLogic.pageData, index);
    const { dimAfterSearchNavigationClass, dimAfterPageNumberPressedClass } = tableLogic.dimClasses;

    switch (row.type) {
      case "department":
      case "section": {
        const isDepartment = row.type === "department";
        const name = isDepartment ? row.departmentName : row.sectionName;
        const className = isDepartment ? s.mainDepartment : s.section;

        const showBreak = isDepartment
          ? dashedBlocks.departments.some(d => d === name)
          : dashedBlocks.sections.includes(name);
        return (
          <td
            className={`${className} ${dimAfterSearchNavigationClass} ${dimAfterPageNumberPressedClass}`}
            colSpan={6}
          >
            {name}
            {showBreak && <img src={torn_pageImg} alt ="Розрив" title ="Розрив" className={s.breakImage} />}
          </td>
        );
      }

      case "user": {
        const userRowIndex = getUserRowIndex({
          pageNumber,
          rowsPerPage,
          index,
          nonUserRowsBefore,
          indexDecrementFromPreviousPages: tableLogic.indexDecrementFromPreviousPages,
        });

        return (
          <>
            <td>{userRowIndex}</td>
            {row.userTypeId !== 1 ? (
              <>
                <td>{row.userName}</td>
                <td />
              </>
            ) : (
              <>
                <td>{row.userPosition}</td>
                <td>{row.userName}</td>
              </>
            )}
            {columns.find(c => c.key === "phones")?.subLabels.map(sub => {
              const phone = row.phones?.find(p => p.phoneType === sub.label);
              return <td key={sub.key}>{phone?.phoneName || ""}</td>;
            })}
          </>
        );
      }

      default:
        return null;
    }
  };

  return <BasePhonesTable renderHeader={renderHeader} renderRowCells={renderRowCells} />;
};

export default PhonesTable;