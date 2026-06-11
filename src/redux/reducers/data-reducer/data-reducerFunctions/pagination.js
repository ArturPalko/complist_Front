export const paginateData = (data, menuKey, rowsPerPage) => {
  let countRows = 0;
  let pageIndex = 1;
  let pages = [];
  let page = { pageIndex, rows: [] };

  const savePage = () => {
    pages.push(page);
    page = { pageIndex: ++pageIndex, rows: [] };
    countRows = 0;
  };

  const processItem = (item) => {
    if (menuKey === "phones") {
      const rows = [];

      rows.push({ type: "department", ...item });

      for (const user of item.users || []) {
        rows.push({ type: "user", ...user, phones: user.phones || [] });
      }

      for (const section of item.sections || []) {
        rows.push({ type: "section", ...section });

        for (const user of section.users || []) {
          rows.push({ type: "user", ...user });
        }
      }

      return rows;
    }

    // NEW: dictionaries support
    if (menuKey === "positions") {
      return [{ ...item, type: "position" }];
    }

    if (menuKey === "userTypes") {
      return [{ ...item, type: "userType" }];
    }

    // default (Lotus, Gov-ua etc.)
    return [item];
  };

  for (const item of data) {
    const rowsToAdd = processItem(item);

    for (const row of rowsToAdd) {
      page.rows.push(row);
      countRows++;
      if (countRows >= rowsPerPage) savePage();
    }
  }

  if (page.rows.length > 0) pages.push(page);

  return pages;
};