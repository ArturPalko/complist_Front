export const CRUD_CONFIG = {
  positions: {
    title: "Посада",
    endpoint: "positions",

    mappers: {
      add: (data) => ({
        name: data.name,
      }),

      edit: (data, modalData) => ({
        id: modalData.id,
        name: data.name,
        priority: modalData.priority,
      }),
    },
  },


  departments: {
    title: "Департаменти",
    endpoint: "departments",

    mappers: {
      add: (data) => ({
        name: data.name,
      }),

      edit: (data, modalData) => ({
        id: modalData.departmentId,
        name: data.name,
        priority: modalData.priority,
      }),
    },
  },

  userTypes: {
    title: "Тип користувача",
    endpoint: "userTypes",

    mappers: {
      add: (data) => ({
        name: data.name,
      }),

      edit: (data, modalData) => ({
        id: modalData.id,
        name: data.name,
        priority: modalData.priority
      }),
    },
  },


  sections: {
    title: "Секції",
    endpoint: "sections",

    mappers: {
      add: (data, modalData) => ({
        name: data.name,
        departmentId: String(modalData.departmentId),
      }),

      edit: (data, modalData) => ({
        id: modalData.sectionId,
        name: data.name,
        priority: modalData.sectionPriority,
        departmentId: modalData.departmentId,
      }),
    },
  },
};

