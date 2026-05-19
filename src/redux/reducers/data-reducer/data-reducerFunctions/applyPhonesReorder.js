import { chunkIntoPages } from "../../../providers/DragProvider/dragProvider-helpers/commonFunctions";

export const applyPhonesReorder = (state, pages) => {
  const priorityMap = new Map(pages.map(p => [p.id, p.priority]));

  const groups = [];

  // 1) build groups (flatten + grouping в одному проході)
  for (const page of state.phones) {
    for (const row of page.rows ?? []) {
      if (row.type === "department") {
        groups.push({
          department: row,
          items: [],
        });
      } else if (groups.length) {
        groups[groups.length - 1].items.push(row);
      }
    }
  }

  // 2) update + collect in one step (без окремого sort array clone)
  const updated = groups
    .map(g => {
      const id = g.department.departmentId;

      return {
        department: {
          ...g.department,
          departmentPriority:
            priorityMap.get(id) ?? g.department.departmentPriority,
        },
        items: g.items,
      };
    })
    .sort(
      (a, b) =>
        (a.department.departmentPriority ?? 9999) -
        (b.department.departmentPriority ?? 9999)
    );

  // 3) final flat rebuild (один reduce замість for)
  const flat = updated.reduce((acc, g) => {
    acc.push(g.department, ...g.items);
    return acc;
  }, []);

  // 4) chunk (замість ручного циклу)
  const pageSize = state.phones[0]?.rows?.length ?? 20;

  const chunked = chunkIntoPages(flat, pageSize);

  // 5) preserve page metadata (мінімально)
  return chunked.map((p, i) => ({
    ...state.phones[i],
    ...p,
  }));
};