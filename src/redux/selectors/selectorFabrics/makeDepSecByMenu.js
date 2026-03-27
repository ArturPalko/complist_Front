export const makeGetDepSecByMenu = (menuKey) => (state) => {
  const menuData = state.data[menuKey];

  const depSecMap = {};
  const secArr = [];

  debugger;

  if (!menuData) {
    return { department: [], sec: [] };
  }

  menuData.forEach(element => {
    if (menuKey === "phones") {
      element.rows?.forEach(row => {
        const { departmentName, sectionName, sections, type } = row;
        if (!type) return;

        if (type === "department" && departmentName) {
          depSecMap[departmentName] =
            sections?.map(s => ({ sectionName: s.sectionName })) || [];
        }

        if (type === "section" && sectionName) {
          secArr.push({ sectionName });
        }
      });
    } else {
      // ✅ FIX: ітеруємось по rows
      element.rows?.forEach(row => {
        // debugger;

        const dep = row.depSec?.department;
        const sec = row.depSec?.section;

        // debugger;

        if (!dep) return;

        if (!depSecMap[dep]) depSecMap[dep] = new Set();
        if (sec) depSecMap[dep].add(sec);
      });
    }
  });

  const dep = Object.entries(depSecMap).map(([departmentName, sectionsSet]) => ({
    departmentName,
    sections: Array.from(sectionsSet).map(sectionName => ({ sectionName }))
  }));
  
  // debugger

  return {
    departments: dep,
    sec: menuKey === "phones" ? secArr : []
  };
};