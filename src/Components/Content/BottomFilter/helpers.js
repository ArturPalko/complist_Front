export const extractDepartmentsAndSections = (selectedSubDepts = {}) => {

  const departments = [];
  const sections = {};

  Object.entries(selectedSubDepts).forEach(([dept, value]) => {

    if (value === true) {
      departments.push(dept);
    }

    if (Array.isArray(value)) {

      if (!sections[dept]) {
        sections[dept] = [];
      }

      value.forEach(section => {
        sections[dept].push(section);
      });

    }

  });

  return { departments, sections };

};