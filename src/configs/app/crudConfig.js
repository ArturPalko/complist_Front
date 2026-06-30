export const CRUD_CONFIG = {
  landline: {
    title: "Номер телефона",
    endpoint: "phones",

    mappers: {
      add: (data) => ({
        number: data.name,
        phoneTypeId:1
      }),

      edit: (data, modalData) => ({
        id: modalData.id,
        name: data.name,
        priority: modalData.priority
      }),
    },
  },

  internal: {
    title: "Номер телефона",
    endpoint: "phones",

    mappers: {
      add: (data) => ({
        number: data.name,
          phoneTypeId:2
      }),

      edit: (data, modalData) => ({
        id: modalData.id,
        name: data.name,
        priority: modalData.priority,
      }),
    },
  },

  cisco: {
    title: "Номер телефона",
    endpoint: "phones",

    mappers: {
      add: (data) => ({
        name: data.name,
          phoneTypeId:3
      }),

      edit: (data, modalData) => ({
        id: modalData.id,
        name: data.name,
        priority: modalData.priority,
      }),
    },
  },



  position: {
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


  department: {
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

  userType: {
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


  section: {
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

