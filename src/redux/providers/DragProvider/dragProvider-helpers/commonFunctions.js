/* =========================
   MOVE LOGIC
========================= */

export const moveItems = (list, ids, toIndex) => {
  const set = new Set(ids);

  const selected = [];
  const rest = [];

  let firstIndex = -1;

  list.forEach((item, idx) => {
    if (set.has(item.id)) {
      selected.push(item);
      if (firstIndex === -1) firstIndex = idx;
    } else {
      rest.push(item);
    }
  });

  if (selected.length === 0) return list;

  const movingDown = toIndex > firstIndex;

  const shift = selected.length;

  const baseIndex = movingDown
    ? toIndex - shift
    : toIndex + 1;

  const safeIndex = Math.max(
    0,
    Math.min(baseIndex, rest.length)
  );

  return [
    ...rest.slice(0, safeIndex),
    ...selected,
    ...rest.slice(safeIndex),
  ];
};

/* =========================
   PAGINATION
========================= */

export const chunkIntoPages = (list, size) => {
  const pages = [];

  for (let i = 0; i < list.length; i += size) {
    pages.push({
      pageIndex: pages.length + 1,
      rows: list.slice(i, i + size),
    });
  }

  return pages;
};