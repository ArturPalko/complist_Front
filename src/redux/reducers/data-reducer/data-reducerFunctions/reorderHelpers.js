import { chunkIntoPages } from "../../../providers/DragProvider/dragProvider-helpers/commonFunctions";

const buildPriorityMap = pages =>
  new Map(
    pages.map(p => [p.id, p.priority])
  );

const flattenRows = phones =>
  phones.flatMap(page => page.rows ?? []);

const rebuildPages = (state, rows) => {
  const pageSize =
    state.phones[0]?.rows?.length ?? 20;

  const chunked = chunkIntoPages(
    rows,
    pageSize
  );

  return chunked.map((p, i) => ({
    ...state.phones[i],
    ...p,
  }));
};

// ========================================
// DEPARTMENTS REORDER
// ========================================

export const reorderDepartments = (
  state,
  pages
) => {

  const priorityMap =
    buildPriorityMap(pages);

  const groups = [];

  // build department groups
  for (const page of state.phones) {
    for (const row of page.rows ?? []) {

      if (row.type === "department") {
        groups.push({
          department: row,
          items: [],
        });
      }

      else if (groups.length) {
        groups[
          groups.length - 1
        ].items.push(row);
      }
    }
  }

  // apply priorities + sort
  const updated = groups
    .map(g => {
      const id =
        g.department.departmentId;

      return {
        department: {
          ...g.department,
          departmentPriority:
            priorityMap.get(id) ??
            g.department.departmentPriority,
        },
        items: g.items,
      };
    })
    .sort(
      (a, b) =>
        (a.department
          .departmentPriority ?? 9999) -
        (b.department
          .departmentPriority ?? 9999)
    );

  // flatten
  const flat = updated.reduce(
    (acc, g) => {
      acc.push(
        g.department,
        ...g.items
      );

      return acc;
    },
    []
  );

  return rebuildPages(state, flat);
};

// ========================================
// SECTIONS REORDER
// ========================================

export const reorderSections = (
  state,
  pages,
  deptId
) => {

  const priorityMap =
    buildPriorityMap(pages);

  const allRows =
    flattenRows(state.phones);

  // find target department block
  const departmentRows = [];

  let insideTargetDepartment = false;

  for (const row of allRows) {

    // start target department
    if (
      row.type === "department" &&
      row.departmentId === deptId
    ) {
      insideTargetDepartment = true;
    }

    // reached next department
    else if (
      row.type === "department" &&
      insideTargetDepartment
    ) {
      break;
    }

    if (insideTargetDepartment) {
      departmentRows.push(row);
    }
  }

  // nothing found
  if (!departmentRows.length) {
    return state.phones;
  }

  const departmentHeader =
    departmentRows[0];

  const departmentItems = [];
  const sections = [];

  let currentSection = null;

  // build section groups
  for (const row of departmentRows.slice(1)) {

    // new section
    if (row.type === "section") {
      currentSection = {
        section: row,
        items: [],
      };

      sections.push(currentSection);
    }

    // rows inside section
    else if (currentSection) {
      currentSection.items.push(row);
    }

    // rows directly under department
    else {
      departmentItems.push(row);
    }
  }

  // apply priorities + sort sections
  const sortedSections = sections
    .map(s => ({
      ...s,
      section: {
        ...s.section,
        sectionPriority:
          priorityMap.get(
            s.section.sectionId
          ) ??
          s.section.sectionPriority,
      },
    }))
    .sort(
      (a, b) =>
        (a.section
          .sectionPriority ?? 9999) -
        (b.section
          .sectionPriority ?? 9999)
    );

  // rebuild department block
  const reorderedDepartmentRows = [
    departmentHeader,

    // department-level items
    ...departmentItems,

    // sections
    ...sortedSections.reduce(
      (acc, s) => {
        acc.push(
          s.section,
          ...s.items
        );

        return acc;
      },
      []
    ),
  ];

  // rebuild all rows
  const rebuiltRows = [];

  let skipDepartment = false;

  for (const row of allRows) {

    // replace target department
    if (
      row.type === "department" &&
      row.departmentId === deptId
    ) {
      skipDepartment = true;

      rebuiltRows.push(
        ...reorderedDepartmentRows
      );

      continue;
    }

    // reached next department
    if (
      row.type === "department" &&
      skipDepartment
    ) {
      skipDepartment = false;
    }

    if (!skipDepartment) {
      rebuiltRows.push(row);
    }
  }

  return rebuildPages(
    state,
    rebuiltRows
  );
};