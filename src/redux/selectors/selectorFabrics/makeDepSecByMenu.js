import { createSelector } from "@reduxjs/toolkit";

import { Pages } from "../../../configs/app/constants";

const EMPTY_ARRAY = [];

const EMPTY_DEP_SEC = {
  departments: EMPTY_ARRAY,
  sec: EMPTY_ARRAY,
};

export const makeGetDepSecByMenu = (menuKey) =>
  createSelector(
    [(state) => state.data?.[menuKey]],
    (menuData) => {
      if (!menuData) {
        return EMPTY_DEP_SEC;
      }

      const depSecMap = {};
      const secArr = [];

      menuData.forEach((element) => {
        if (menuKey === Pages.PHONES) {
          element.rows?.forEach((row) => {
            const {
              departmentName,
              sectionName,
              sections,
              type,
            } = row;

            if (!type) return;

            if (type === "department" && departmentName) {
              depSecMap[departmentName] =
                sections?.map((s) =>
                  s && typeof s.sectionName === "string"
                    ? s.sectionName
                    : s
                ) ?? EMPTY_ARRAY;
            }

            if (type === "section" && sectionName) {
              secArr.push({
                sectionName:
                  typeof sectionName === "string"
                    ? sectionName
                    : sectionName?.sectionName,
              });
            }
          });

          return;
        }

        element.rows?.forEach((row) => {
          const dep = row.depSec?.department;
          const sec = row.depSec?.section;

          if (!dep) return;

          if (!depSecMap[dep]) {
            depSecMap[dep] = new Set();
          }

          if (sec) {
            depSecMap[dep].add(sec);
          }
        });
      });

      const departments = Object.entries(depSecMap).map(
        ([departmentName, sectionsArr]) => ({
          departmentName,
          sections: Array.isArray(sectionsArr)
            ? sectionsArr.map((sectionName) => ({
                sectionName,
              }))
            : Array.from(sectionsArr).map((sectionName) => ({
                sectionName,
              })),
        })
      );

      return {
        departments,
        sec:
          menuKey === Pages.PHONES
            ? secArr
            : EMPTY_ARRAY,
      };
    }
  );