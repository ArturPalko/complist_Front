export const makeGetDepSecByMenu = (menuKey) => (state) => {
  const menuData = state.data[menuKey];

  const depSecMap = {};
  const secArr = [];

  if (!menuData) {
    return { departments: [], sec: [] };
  }

  menuData.forEach(element => {
    if (menuKey === "phones") {
      element.rows?.forEach(row => {
        const { departmentName, sectionName, sections, type } = row;
        if (!type) return;

        if (type === "department" && departmentName) {
          // 🔹 Очищаємо подвійний об’єкт
          depSecMap[departmentName] =
            sections?.map(s =>
              // якщо s вже об’єкт з ключем sectionName, беремо рядок
              s && typeof s.sectionName === "string" ? s.sectionName : s
            ) || [];
        }

        if (type === "section" && sectionName) {
          // sectionName має бути рядком
          secArr.push({ sectionName: typeof sectionName === "string" ? sectionName : sectionName?.sectionName });
        }
      });
    } else {
      element.rows?.forEach(row => {
        const dep = row.depSec?.department;
        const sec = row.depSec?.section;

        if (!dep) return;

        if (!depSecMap[dep]) depSecMap[dep] = new Set();
        if (sec) depSecMap[dep].add(sec);
      });
    }
  });

  const dep = Object.entries(depSecMap).map(([departmentName, sectionsArr]) => ({
    departmentName,
    sections: Array.isArray(sectionsArr)
      ? sectionsArr.map(sectionName => ({ sectionName }))
      : Array.from(sectionsArr).map(sectionName => ({ sectionName }))
  }));

  return {
    departments: dep,
    sec: menuKey === "phones" ? secArr : []
  };
};