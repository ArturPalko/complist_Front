export const buildSectionPages = (sections, pageSize = 18) => {
  const result = [];

  for (let i = 0; i < sections.length; i += pageSize) {
    result.push({
      pageIndex: result.length + 1,
      rows: sections.slice(i, i + pageSize),
    });
  }

  return result;
};