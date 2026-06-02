import s from "./PhonesTable.module.css";
import { usePhonesTableLogic } from "../../../../redux/hooks/usePhonesTableLogic";
import { createTableComponent } from "../../../../shared/components/table/TableWrapper/tableFactory";
import { countNonUserRowsBefore, getUserRowIndex, handleOnOpenSectionsButtonClick } from "./phonesTableHelpers";
import torn_pageImg from "../../../../assets/Img/torn_page.png";
import { useDispatch } from "react-redux";

const BasePhonesTable = createTableComponent(usePhonesTableLogic);

const PhonesTable = ({ columns, pageNumber, rowsPerPage, isSections }) => {
  const dispatch = useDispatch();
  const renderHeader = () => (
    <>
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
          .filter((c) => c.key === "phones")
          .flatMap((col) =>
            col.subLabels.map((sub) => (
              <th key={sub.key}>{sub.label}</th>
            ))
          )}
      </tr>
    </>
  );

  const renderRowCells = (row, index, tableLogic) => {
    const nonUserRowsBefore = countNonUserRowsBefore(
      tableLogic.pageData,
      index
    );

const idMap = {
  department: "departmentId",
  section: "sectionId",
  position: "id",
  userType: "id",
};

const idKey = idMap[row.type];
const dim = tableLogic.getRowDimClasses(row[idKey]);

// console.log("DIM OBJECT", dim);

    switch (row.type) {
      case "userType":
      case "position":
      case "department":
      case "section": {
        const isDepartment = row.type === "department";
        const isSection = row.type === "section";
        const isPosition = row.type === "position";
        const isUserType = row.type === "userType";

        const name = isDepartment
          ? row.departmentName
          : isSection
          ? row.sectionName
          : isPosition
          ? row.positionName
          : isUserType
          ? row.userType
          : row.name;

        const className = isDepartment
          ? s.mainDepartment
          : isPosition || isUserType
          ? s.positionsAndUserTypes
          : s.section;

        const showBreak = isDepartment
          ? tableLogic.dashedBlocks.departments.some(
              (d) => d === name
            )
          : tableLogic.dashedBlocks.sections.includes(name);

        return (
<td
  className={[
    className,
    dim.hidden ? "" : dim.dimAfterSearchNavigationClass,
    dim.hidden ? "" : dim.dimAfterPageNumberPressedClass,
  ].filter(Boolean).join(" ")}
  colSpan={6}
>
            <div className={s.groupRowContent}>
              {/* CENTER NAME */}
              <span>{name}</span>

              {/* RIGHT CONTROLS */}
              {isSections &&
                Array.isArray(row.sections) &&
                row.sections.length > 0 && (
                  <div className={s.groupRowActions}>
                    <span className={s.sectionsCount}>
                      ({row.sections.length})
                    </span>

                    <button
                      className={s.viewSectionsButton}
                      onClick={(e) => {
                            e.stopPropagation();

                            handleOnOpenSectionsButtonClick({
                              isSections,
                              item: row,
                              dispatch,
                            })(e);
                          }}
                    >
                      Переглянути
                    </button>
                  </div>
                )}

              {/* BREAK IMAGE */}
              {showBreak && (
                <img
                  src={torn_pageImg}
                  alt="Розрив"
                  title="Розрив"
                  className={s.breakImage}
                />
              )}
            </div>
          </td>
        );
      }

      case "user": {
        const userRowIndex = getUserRowIndex({
          pageNumber,
          rowsPerPage,
          index,
          nonUserRowsBefore,
          indexDecrementFromPreviousPages:
            tableLogic.indexDecrementFromPreviousPages,
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

            {columns
              .find((c) => c.key === "phones")
              ?.subLabels.map((sub) => {
                const phone = row.phones?.find(
                  (p) => p.phoneType === sub.label
                );

                return (
                  <td key={sub.key}>
                    {phone?.phoneName || ""}
                  </td>
                );
              })}
          </>
        );
      }

      default:
        return null;
    }
  };

  return (
    <BasePhonesTable
      renderHeader={renderHeader}
      renderRowCells={renderRowCells}
    />
  );
};

export default PhonesTable;