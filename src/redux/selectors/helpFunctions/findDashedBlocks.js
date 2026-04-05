export const findDashedBlocks = (pages) => {
  const result = { departments: [], sections: [] };

  pages.forEach((page, index) => {
    const nextPage = pages[index + 1];
    if (!nextPage?.rows?.length) return;

    const rows = page.rows;

    // --- останній department на поточній сторінці
    const lastDepartment = [...rows].reverse().find((row) => row.type === "department");
    if (!lastDepartment) return;

    const firstNextRow = nextPage.rows[0];

    // --- перевіряємо, чи на наступній сторінці є секції цього департаменту
const hasSectionsOnNextPage = nextPage.rows.some(
  (row) =>
    row.type === "section" &&
    row.departmentName === lastDepartment.departmentName
);
const hasSectionsOnCurrentPage = rows.some(
  (row) =>
    row.type === "section" &&
    row.departmentName === lastDepartment.departmentName
);

const b =
  firstNextRow.departmentName === lastDepartment.departmentName;

const firstRowMatchesDepartment =
  !hasSectionsOnCurrentPage &&
  !hasSectionsOnNextPage &&
  b;

const shouldAddDepartment =
  hasSectionsOnNextPage || firstRowMatchesDepartment;

    if (shouldAddDepartment) {
      result.departments.push(lastDepartment.departmentName);
    }

    // --- останній section на поточній сторінці
    const lastSection = [...rows].reverse().find((row) => row.type === "section");
    if (!lastSection) return;

    // --- перевірка, чи перший рядок наступної сторінки належить тій же секції
    if (firstNextRow.sectionName === lastSection.sectionName) {
      result.sections.push(lastSection.sectionName);
    }
  });

  return result;
};