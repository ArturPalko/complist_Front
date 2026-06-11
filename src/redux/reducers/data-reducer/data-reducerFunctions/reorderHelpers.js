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





export const orderByPositions = (state, pages) => {
  if (!Array.isArray(state?.phones)) return state.phones;

  // 1. priority map
  const priorityMap = pages.reduce((acc, p) => {
    acc[String(p.id)] = p.priority;
    return acc;
  }, {});

  // 2. flatten
  const rows = state.phones.flatMap(p => p.rows ?? []);

  const result = [];
  let buffer = [];

  const flush = () => {
    if (!buffer.length) return;

    buffer.sort((a, b) =>
      (a.userPositionPriority ?? 9999) -
      (b.userPositionPriority ?? 9999)
    );

    result.push(...buffer);
    buffer = [];
  };

  // 3. apply segment sort
  for (const row of rows) {
    if (row.type === "user") {
      const key = String(row.userPositionId);

      const newPriority = priorityMap[key];

      buffer.push({
        ...row,
        userPositionPriority:
          newPriority ?? row.userPositionPriority
      });

      continue;
    }

    flush();
    result.push(row);
  }

  flush();

  // 4. rebuild pages (🔥 ВАЖЛИВО)
  const pageSize = state.phones[0]?.rows?.length ?? 20;

  const chunked = chunkIntoPages(result, pageSize);

  return chunked.map((p, i) => ({
    ...state.phones[i],
    ...p
  }));
};

export const orderByUserTypes = (state, pages) => {
    
  if (!Array.isArray(state?.phones)) return state.phones;

  // 1. priority map (userTypeId -> priority)
  const priorityMap = pages.reduce((acc, p) => {
    acc[String(p.id)] = p.priority;
    return acc;
  }, {});

  // 2. flatten
  const rows = state.phones.flatMap(p => p.rows ?? []);

  const result = [];
  let buffer = [];

  const flush = () => {
    if (!buffer.length) return;

    buffer.sort((a, b) =>
      (a.userTypePriority ?? 9999) -
      (b.userTypePriority ?? 9999)
    );

    result.push(...buffer);
    buffer = [];
  };

  // 3. apply segment sort
  for (const row of rows) {
    if (row.type === "user") {

      const key = String(row.userTypeId);

      const newPriority = priorityMap[key];

      buffer.push({
        ...row,
        userTypePriority:
          newPriority ?? row.userTypePriority
      });

      continue;
    }

    flush();
    result.push(row);
  }

  flush();

  // 4. rebuild pages
  const pageSize = state.phones[0]?.rows?.length ?? 20;

  const chunked = chunkIntoPages(result, pageSize);
debugger
  return chunked.map((p, i) => ({
    ...state.phones[i],
    ...p
  }));
};