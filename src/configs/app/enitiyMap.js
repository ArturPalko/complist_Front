export const entityMap = {
  department: {
    id: "departmentId",
    name: "departmentName",
    className: "mainDepartment",
  },
  section: {
    id: "sectionId",
    name: "sectionName",
    className: "section",
    extra: ["departmentId"], // 👈 додаткові поля
  },
  position: {
    id: "id",
    name: "positionName",
    className: "positionsAndUserTypes",
  },
  userType: {
    id: "id",
    name: "userType",
    className: "positionsAndUserTypes",
  },
};