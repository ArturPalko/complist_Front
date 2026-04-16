import styles from "./DepartmentList.module.css";
import { DeptRowControls } from "./DeptRowControls/DeptRowControls";

export const DepartmentsList = ({
  departments,
  selectedSubDepts,
  expandedDept,
  toggleDept,
  toggleExpand,
  refs,
  activeMenu
}) => {
  return (
    <>
      {departments.map(dept => {
        const selectedSubs = selectedSubDepts[dept.departmentName] || [];
        const hasSubs = dept.sections?.length > 0;

        const isChecked = hasSubs
          ? selectedSubs.length === dept.sections.length
          : !!selectedSubDepts[dept.departmentName];

        const isIndeterminate =
          hasSubs &&
          selectedSubs.length > 0 &&
          selectedSubs.length < dept.sections.length;

        return (
          <div key={dept.departmentName} className={styles.deptLabel}>
            <label>
              <input
                type="checkbox"
                ref={el => {
                  refs.current[dept.departmentName] = el;
                  if (el) el.indeterminate = isIndeterminate;
                }}
                checked={isChecked}
                onChange={() => toggleDept(dept.departmentName)}
              />
              {dept.departmentName}
            </label>
          
            <DeptRowControls
              activeMenu={activeMenu}
              dept={dept}
              hasSubs={hasSubs}
              isChecked={isChecked}
              isIndeterminate={isIndeterminate}
              expandedDept={expandedDept}
              toggleExpand={toggleExpand}
            />
          </div>
        );
      })}
    </>
  );
};
