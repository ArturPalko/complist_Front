export const handleOnCheckboxChangeHandler = ({
  key,
  activeMenu,
  lotusFilters,
  setLotusFilters,
  govUaFilters,
  setGovUaFilters,
  phonesFilters,
  setPhonesFilters,
  setPhonesSubConditions,
  phonesSubConditions,
  addFilter,
  redirectToCurrentPage,
  hasAnyFilters,
  clearCurrentForm
}) => {
  let currentFilters;
  let setFiltersFn;

  if (activeMenu === "Lotus") {
    currentFilters = lotusFilters;
    setFiltersFn = setLotusFilters;
  } else if (activeMenu === "Gov-ua") {
    currentFilters = govUaFilters;
    setFiltersFn = setGovUaFilters;
  } else {
    currentFilters = phonesFilters;
    setFiltersFn = setPhonesFilters;
  }

  // Оновлюємо галку
  const newFilters = { ...currentFilters, [key]: !currentFilters[key] };

  // ---------------- Синхронізація subConditions для phones ----------------
  let newSubConditions = { ...phonesSubConditions };
  if (activeMenu === "phones") {
    Object.entries(newSubConditions).forEach(([category, keysObj]) => {
      if (!keysObj) return;

      Object.keys(keysObj).forEach(k => {
        // Видаляємо subCondition для ключів, де галка вимкнена
        if (!newFilters[k]) {
          delete keysObj[k];
        }
      });

      // Якщо category порожня після видалення ключів, видаляємо її
      if (Object.keys(keysObj).length === 0) {
        delete newSubConditions[category];
      }
    });
  }
  // ---------------------------------------------------------------------------

  // Перевірка, чи залишились активні фільтри
  const anyFiltersLeft = hasAnyFilters(newFilters, newSubConditions);

  if (!anyFiltersLeft) {
    setFiltersFn({});
    if (activeMenu === "phones") setPhonesSubConditions({});
    clearCurrentForm?.(activeMenu);
    redirectToCurrentPage?.({}, {});
    return;
  }

  // Застосовуємо оновлені значення
  setFiltersFn(newFilters);
  if (activeMenu === "phones") setPhonesSubConditions(newSubConditions);

  // Диспатч
  addFilter(activeMenu, key);

  // Редірект
  redirectToCurrentPage?.(newFilters, newSubConditions);
};
