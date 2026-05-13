export const makeGetPhonesSort = (menuKey) => (state) => {
  const menuData = state.data[menuKey];

  if (!menuData) {
    return { departments: [], pages: [] };
  }

  // =========================
  // 1. FLATTEN departments
  // =========================
  const departments = [];
debugger
  menuData.forEach((element) => {
    element.rows?.forEach((row) => {
      if (row.type === "department") {
        departments.push({
          ...row,
          departmentId: row.departmentId || row.departmentName,
          departmentPriority: row.departmentPriority ?? 0
        });
      }
    });
  });

  // =========================
  // 2. SORT
  // =========================
  const sorted = [...departments].sort(
    (a, b) => a.departmentPriority - b.departmentPriority
  );

  // =========================
  // 3. SPLIT INTO PAGES (18 rows)
  // =========================
  const pageSize = 18;

  const pages = [];

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