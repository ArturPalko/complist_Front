export const makeGetDepartmentsByMenu = (menuKey) => (state) => {
  const menuData = state.data[menuKey];

  if (!menuData) {
    return { departments: [], pages: [] };
  }

  // =========================
  // 1. FLATTEN departments
  // =========================
  const departments = [];

  menuData.forEach((element) => {
    element.rows?.forEach((row) => {
      if (row.rowType === "department") {
        departments.push({
          ...row, // 🔥 весь department object

          departmentId: row.departmentId || row.departmentName,
          departmentPriority: row.departmentPriority ?? departments.length + 1
        });
      }
    });
  });

  // =========================
  // 2. SORT (важливо для drag)
  // =========================
  const sorted = [...departments].sort(
    (a, b) => a.departmentPriority - b.departmentPriority
  );

  // =========================
  // 3. SPLIT INTO PAGES (18 items)
  // =========================
  const pages = [];
  const pageSize = 18;

  for (let i = 0; i < sorted.length; i += pageSize) {
    pages.push({
      pageIndex: pages.length + 1,
      rows: sorted.slice(i, i + pageSize)
    });
  }

  return {
    departments: sorted,
    pages
  };
};