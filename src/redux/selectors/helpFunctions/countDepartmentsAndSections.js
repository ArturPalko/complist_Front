
export const countDepartmentsAndSections = (pages) => {
  if (!Array.isArray(pages)) return [];
  
  return pages.map(page => {
    let count = 0;
    if (!Array.isArray(page.rows)) return 0;

    page.rows.forEach(row => {
      if (row.type === "department" || row.type === "section") {
        count++;
      }
    });

    return count;
  });
};
