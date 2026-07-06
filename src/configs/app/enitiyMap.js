export const entityMap = {
   landline: {
    id: "id",
    name: "number",
    className: "mainDepartment",
  },
  internal: {
    id: "id",
    name: "number",
    className: "mainDepartment",
  },
   cisco: {
    id: "id",
    name: "number",
    className: "mainDepartment",
  },
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
   user: {
    id: "userId",
    name: "userName"
  },
  phone: {
    id: "id",
    name: "number"
  },
};