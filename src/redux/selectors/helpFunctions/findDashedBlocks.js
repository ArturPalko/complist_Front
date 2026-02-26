export const findDashedBlocks = (pages) => {
  const result = { departments: [], sections: [] };

  pages.forEach((page, index) => {
    const nextPage = pages[index + 1];
    if (!nextPage?.rows?.length) return;

    const rows = page.rows;

    //  останній department
    const lastDepartment = [...rows].reverse().find((row) => row.type === "department");

    if (lastDepartment) {
      const firstNextRow = nextPage.rows[0];
      const hasSectionsOnPage = lastDepartment.sections?.length > 0;

      // якщо на сторінці є секції після департаменту
      const shouldAddDepartment =
        hasSectionsOnPage
          ? nextPage.rows.some(
              (row) =>
                row.type === "section" &&
                row.departmentName === lastDepartment.departmentName
            )
          : firstNextRow.type === "department" &&
            firstNextRow.departmentName === lastDepartment.departmentName;

      if (shouldAddDepartment) result.departments.push(lastDepartment.departmentName);
    }

    //  останній section
    const lastSection = [...rows].reverse().find((row) => row.type === "section");

    if (lastSection) {
      const firstNextRow = nextPage.rows[0];
      if (firstNextRow.sectionName === lastSection.sectionName) {
        result.sections.push(lastSection.sectionName);
      }
    }
  });

  return result;
};