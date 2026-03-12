import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDepartmentsAndSections } from '../../../redux/selectors/selector';
import styles from './BottomFilter.module.css';



export const BottomFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedDept, setExpandedDept] = useState(null);

  const [selectedSubDepts, setSelectedSubDepts] = useState({});
  const [selectedOrder, setSelectedOrder] = useState([]);

  const refs = useRef({});
  const depSec = useSelector(getDepartmentsAndSections);
  const departments = depSec.departments || [];

  // Вибір/зняття департаменту
  const toggleDept = (deptName) => {
    const dept = departments.find(d => d.departmentName === deptName);
    const allSubs = dept?.sections || [];

    // Департамент без підпідрозділів
    if (allSubs.length === 0) {
      setSelectedSubDepts(prev => {
        const newDepts = { ...prev };
        let newOrder = [...selectedOrder];

        if (prev[deptName]) {
          delete newDepts[deptName];
          newOrder = newOrder.filter(d => d !== deptName);
        } else {
          newDepts[deptName] = true;
          if (!newOrder.includes(deptName)) newOrder.push(deptName);
        }

        setSelectedOrder(newOrder);
        return newDepts;
      });
      return;
    }

    // Департамент з підпідрозділами
    setSelectedSubDepts(prev => {
      const selectedSubs = prev[deptName] || [];
      const newSubs = selectedSubs.length === allSubs.length ? [] : [...allSubs];

      let newOrder = selectedOrder.filter(d => d !== deptName);
      if (newSubs.length > 0) newOrder.push(deptName);
      setSelectedOrder(newOrder);

      return { ...prev, [deptName]: newSubs };
    });
  };

  // Вибір/зняття підпідрозділу
  const toggleSubDept = (deptName, sub) => {
    setSelectedSubDepts(prev => {
      const subs = prev[deptName] || [];
      const newSubs = subs.includes(sub) ? subs.filter(s => s !== sub) : [...subs, sub];

      // Оновлюємо порядок департаментів
      let newOrder = selectedOrder.filter(d => d !== deptName);
      if (newSubs.length > 0) newOrder.push(deptName);
      setSelectedOrder(newOrder);

      return { ...prev, [deptName]: newSubs };
    });
  };

  const toggleExpand = (deptName) => {
    setExpandedDept(expandedDept === deptName ? null : deptName);
  };

  // Indeterminate для частково вибраних підпідрозділів
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

  // Формуємо текст для кнопки: перші 2 елементи + +N ще
  const visibleCount = 2;
  const visibleSelected = selectedOrder.slice(0, visibleCount);
  const extraCount = Math.max(0, selectedOrder.length - visibleCount);
  const selectedText = visibleSelected.length > 0
    ? visibleSelected.join(', ') + (extraCount > 0 ? ` +${extraCount} ще` : '')
    : 'Оберіть підрозділи';
  debugger;
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

              const isChecked = hasSubs
                ? selectedSubs.length === dept.sections.length
                : !!selectedSubDepts[dept.departmentName];
              const isIndeterminate = hasSubs && selectedSubs.length > 0 && selectedSubs.length < dept.sections.length;

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
                    {' '}{dept.departmentName}
                  </label>
                  {hasSubs &&
                    <span className={styles.arrow} onClick={() => toggleExpand(dept.departmentName)}>
                      {expandedDept === dept.departmentName ? '▶' : '◀'}
                    </span>
                  }
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