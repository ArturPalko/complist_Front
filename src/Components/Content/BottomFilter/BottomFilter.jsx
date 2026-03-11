import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDepartmentsAndSections } from '../../../redux/selectors/selector';
import styles from './BottomFilter.module.css';

export const BottomFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedDept, setExpandedDept] = useState(null);
  const [selectedSubDepts, setSelectedSubDepts] = useState({});
  const refs = useRef({});

  const depSec = useSelector(getDepartmentsAndSections);
  const departments = depSec.departments || [];

  const toggleDept = (deptName) => {
    const dept = departments.find(d => d.departmentName === deptName);
    const allSubs = dept?.sections || [];
    const selectedSubs = selectedSubDepts[deptName] || [];

    if (allSubs.length > 0) {
      setSelectedSubDepts(prev => ({
        ...prev,
        [deptName]: selectedSubs.length === allSubs.length ? [] : [...allSubs]
      }));
    } else {
      setSelectedSubDepts(prev => ({
        ...prev,
        [deptName]: selectedSubs.length > 0 ? [] : [deptName]
      }));
    }
  };

  const toggleSubDept = (deptName, sub) => {
    setSelectedSubDepts(prev => {
      const subs = prev[deptName] || [];
      const newSubs = subs.includes(sub) ? subs.filter(s => s !== sub) : [...subs, sub];
      return { ...prev, [deptName]: newSubs };
    });
  };

  const toggleExpand = (deptName) => {
    setExpandedDept(expandedDept === deptName ? null : deptName);
  };

  useEffect(() => {
    departments.forEach(dept => {
      const allSubs = dept.sections || [];
      const selectedSubs = selectedSubDepts[dept.departmentName] || [];
      const ref = refs.current[dept.departmentName];
      if (ref && allSubs.length > 0) {
        ref.indeterminate = selectedSubs.length > 0 && selectedSubs.length < allSubs.length;
      }
    });
  }, [selectedSubDepts, departments]);

  const selectedText = Object.keys(selectedSubDepts)
    .filter(d => selectedSubDepts[d]?.length > 0)
    .join(', ') || 'Оберіть підрозділи';

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={() => setIsOpen(!isOpen)} title={selectedText}>
        {selectedText}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.box}>
            <h4>Підрозділи</h4>
            {departments.map(dept => {
              const selectedSubs = selectedSubDepts[dept.departmentName] || [];
              const hasSubs = dept.sections?.length > 0;
              return (
                <div key={dept.departmentName} className={styles.deptLabel}>
                  <label>
                    <input
                      type="checkbox"
                      ref={el => (refs.current[dept.departmentName] = el)}
                      checked={hasSubs ? selectedSubs.length === dept.sections.length : selectedSubs.length > 0}
                      onChange={() => toggleDept(dept.departmentName)}
                    />
                    {' '}{dept.departmentName}
                  </label>
                  <span className={styles.arrow} onClick={() => toggleExpand(dept.departmentName)}>
                    {expandedDept === dept.departmentName ? '▶' : '◀'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={styles.boxRight}>
            <h4>Підпідрозділи</h4>
            {expandedDept === null && <p>Натисніть стрілку ліворуч, щоб показати підпідрозділи</p>}
            {expandedDept && (
              <div>
                {(departments.find(d => d.departmentName === expandedDept)?.sections || []).map(sub => (
                  <label key={sub.sectionId || sub} className={styles.subLabel}>
                    <input
                      type="checkbox"
                      checked={selectedSubDepts[expandedDept]?.includes(sub) || false}
                      onChange={() => toggleSubDept(expandedDept, sub)}
                    />
                    {' '}{sub.sectionName || sub}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomFilter;