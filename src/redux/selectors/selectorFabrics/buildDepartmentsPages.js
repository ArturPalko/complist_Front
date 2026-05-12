export const buildDepartmentPages = (pages, pageSize = 18) => {
  const departments = pages
    ?.flatMap(p => p?.rows ?? [])
    ?.filter(r => r.type === "department") ?? [];

  const result = [];

  for (let i = 0; i < departments.length; i += pageSize) {
    result.push({
      pageIndex: result.length + 1,
      rows: departments.slice(i, i + pageSize),
    });
  }

  return result;
};