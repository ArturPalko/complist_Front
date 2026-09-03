import { PHONE_TYPES } from "../../../configs/app/constants";

export const getBottomTableDescription = ({
  currentMenu,
  currentMode,
  activeDep,
}) => {
  if (
    (currentMenu === "Gov-ua" || currentMenu === "Lotus") &&
    !currentMode
  ) {
    return "Доступна зміна порядку елементів через перетягування.";
  }

  if (currentMenu === "phones" && !currentMode) {
    return `Наповнення таблиці змінюється шляхом встановлення прив’язок.
Для цього скористайтеся кнопкою «Прив’язати телефони».

Порядок відображення можна змінити, обравши відповідний режим:
департаменти, секції, типи телефонів або посади.`;
  }

  if (
    currentMode === "departments" &&
    !activeDep
  ) {
    return `• Порядок департаментів визначає порядок їх відображення в меню «Телефони».
• Світліші рядки — департаменти, які не представлені в цьому меню та не впливають на позначки розриву.
• Після зміни порядку перейдіть на сторінку «Телефони», щоб оновити позначки розриву.`;
  }

if (
  currentMode === "users" ||
  PHONE_TYPES.includes(currentMode)
) {
  return "Тут можна відсортувати за заголовками стовпців.";
}
  if (
    currentMode === "userTypes" ||
    currentMode === "positions" ||
    (currentMode === "sections" && activeDep)
  ) {
    return "Доступна зміна порядку елементів через перетягування.";
  }

  return "";
};