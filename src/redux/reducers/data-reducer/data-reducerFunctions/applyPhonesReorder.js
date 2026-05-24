import { chunkIntoPages } from "../../../providers/DragProvider/dragProvider-helpers/commonFunctions";

export const applyPhonesReorder = (state, pages, deptId) => {
  // sectionId -> newPriority
  const priorityMap = new Map(
    pages.map(p => [p.id, p.priority])
  );

  // 1) flatten all rows
  const allRows = state.phones.flatMap(
    page => page.rows ?? []
  );

  // 2) find target department block
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

  // 3) keep department header
  const departmentHeader = departmentRows[0];

  // 4) collect:
  // - department-level rows
  // - sections with their rows
  const departmentItems = [];
  const sections = [];

  let currentSection = null;

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

  // 5) apply priorities + sort sections
  const sortedSections = sections
    .map(s => ({
      ...s,
      section: {
        ...s.section,
        sectionPriority:
          priorityMap.get(s.section.sectionId) ??
          s.section.sectionPriority,
      },
    }))
    .sort(
      (a, b) =>
        (a.section.sectionPriority ?? 9999) -
        (b.section.sectionPriority ?? 9999)
    );

  // 6) rebuild department block
  const reorderedDepartmentRows = [
    departmentHeader,

    // department-level users/items
    ...departmentItems,

    // sorted sections
    ...sortedSections.reduce((acc, s) => {
      acc.push(s.section, ...s.items);
      return acc;
    }, []),
  ];

  // 7) rebuild all rows
  const rebuiltRows = [];

  let skipDepartment = false;

  for (const row of allRows) {
    // replace target department
    if (
      row.type === "department" &&
      row.departmentId === deptId
    ) {
      skipDepartment = true;

      rebuiltRows.push(...reorderedDepartmentRows);

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

  // 8) chunk back into pages
  const pageSize =
    state.phones[0]?.rows?.length ?? 20;

  const chunked = chunkIntoPages(
    rebuiltRows,
    pageSize
  );

  // 9) preserve page metadata
  return chunked.map((p, i) => ({
    ...state.phones[i],
    ...p,
  }));
};