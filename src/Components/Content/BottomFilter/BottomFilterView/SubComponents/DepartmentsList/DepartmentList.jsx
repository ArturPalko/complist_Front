import s from "./DepartmentList.module.css";
import { DeptRowControls } from "./DeptRowControls/DeptRowControls";

export const DepartmentsList = ({
  bookmarks,
  departments,
  selectedSubDepts,
  expandedDept,
  onToggleDept,
  toggleExpand,
  onToggleHideSections,
  onToggleHideUsers,
  refs,
  showExtraToggles
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
          <div key={dept.departmentName} className={s.deptLabel}>
            <label>
              <input
                type="checkbox"
                ref={el => {
                  refs.current[dept.departmentName] = el;
                  if (el) el.indeterminate = isIndeterminate;
                }}
                checked={isChecked}
                onChange={() => onToggleDept(dept.departmentName)}
              />
              {dept.departmentName}
            </label>
          
            <DeptRowControls
              bookmarks={bookmarks}
             showExtraToggles={showExtraToggles}
              dept={dept}
              hasSubs={hasSubs}
              isChecked={isChecked}
              isIndeterminate={isIndeterminate}
              expandedDept={expandedDept}
              toggleExpand={toggleExpand}
              onToggleHideSections={onToggleHideSections}
              onToggleHideUsers={onToggleHideUsers}
            />
          </div>
        );
      })}
    </>
  );
};
