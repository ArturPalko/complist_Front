const ADD_PHONES = "ADD_PHONES";

const initialState = {
  phones: []
};

export const phonesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PHONES: {
      const limitRows = 18;
      let countRows = 0;
      let pageIndex = 1;
      let pages = [];
      let page = { pageIndex, rows: [] };

      function savePage() {
        pages.push(page);
        page = { pageIndex: ++pageIndex, rows: [] };
        countRows = 0;
      }

      for (const dep of action.data) {
        // рядок департаменту
        page.rows.push({ type: "department", ...dep });
        countRows++;
        if (countRows >= limitRows) savePage();

        // користувачі департаменту
        for (const user of dep.users || []) {
          page.rows.push({ type: "user", ...user, phones: user.phones || [] });
          countRows++;
          if (countRows >= limitRows) savePage();
        }

        // секції департаменту
        for (const section of dep.sections || []) {
          page.rows.push({ type: "section", ...section });
          countRows++;
          if (countRows >= limitRows) savePage();

          // користувачі секції
          for (const user of section.users || []) {
            page.rows.push({ type: "user", ...user });
            countRows++;
            if (countRows >= limitRows) savePage();
          }
        }
      }

      // додати останню сторінку, якщо там є рядки
      if (page.rows.length > 0) {
        pages.push(page);
      }

      return {
        ...state,
        phones: pages
      };
    }

    default:
      return state;
  }
};

export const addPhonesActionCreator = (data) => ({
  type: ADD_PHONES,
  data
});
