/**
 * Розбиває масив data на сторінки по rowsPerPage.
 * Підтримує mails і phones.
 *
 * @param {Array} data - масив даних (mails або phones)
 * @param {string} menuKey - "phones" або "Lotus"/"Gov-ua"
 * @param {number} rowsPerPage - кількість рядків на сторінку
 * @returns {Array} pages - масив сторінок { pageIndex, rows }
 */
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

  // для phones треба розпаковувати департаменти, секції та користувачів
  const processItem = (item) => {
    if (menuKey === "phones") {
      const rows = [];

      // департамент
      rows.push({ type: "department", ...item });

      // користувачі департаменту
      for (const user of item.users || []) {
        rows.push({ type: "user", ...user, phones: user.phones || [] });
      }

      // секції департаменту
      for (const section of item.sections || []) {
        rows.push({ type: "section", ...section });

        // користувачі секції
        for (const user of section.users || []) {
          rows.push({ type: "user", ...user });
        }
      }

      return rows;
    } else {
      // для mails — просто рядки
      return [item];
    }
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
