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

  userTypes: {
    title: "Тип користувача",
    endpoint: "userTypes",

    mappers: {
      add: (data) => ({
        name: data.name,
      }),

      edit: (data, modalData) => ({
        id: modalData.id,
        name: data.userType,
        priority: modalData.priority
      }),
    },
  },
};