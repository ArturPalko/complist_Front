export const getNormalizedRowData = (el, activeMenu) => {
  const deptName =
    activeMenu === "phones"
      ? el.departmentName
      : el.depSec?.department || "";

  const rawSection =
    activeMenu === "phones"
      ? el.sectionName
      : el.depSec?.section;

  return {
    deptName,
    sectionName: rawSection || null, // 🔥 ключ: завжди або string, або null
    isUserWithoutSection: !rawSection
  };
};