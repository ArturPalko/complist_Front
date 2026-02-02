import { filterGroups,conditions } from "./filtersLogics";
// Перевірка проходження рядка / користувача
 export const passesFiltersForRow = (row, activeFilters = [], subConditions = {}) => {
    const checkRowOrUser = (el) => {
        const filtersPass = activeFilters.length === 0
        ? true
        : activeFilters.every(key => {

            // 1. знайти parent-групу (ключ, у якому сидить цей фільтр)
            const parentKey = Object.keys(filterGroups).find(
                grp => filterGroups[grp].includes(key)
            );

            // 2. Якщо немає групи — звичайна перевірка
            if (!parentKey) {
                return typeof conditions[key] === "function" && conditions[key](el);
            }

            // 3. Якщо є група → виділяємо всі альтернативи
            const alternatives = filterGroups[parentKey];

            // 4. Але OR робимо тільки між ТИМИ, що є у activeFilters
            const activeAlternatives = alternatives.filter(a =>
                activeFilters.includes(a)
            );

            // 5. Якщо активна лише одна альтернатива → звичайний OR через одну
            return activeAlternatives.some(a =>
                typeof conditions[a] === "function" && conditions[a](el)
            );
            })
        
        const subConditionsPass = Object.values(subConditions || {}).some(groupObj => Object.keys(groupObj || {}).length > 0)
            ? Object.values(subConditions || {}).some(groupObj =>
                Object.values(groupObj || {}).some(condFn => condFn(el))
            )
            : true;

        return filtersPass && subConditionsPass;
        };

        if (row?.type === "department") {
        const usersPass = row.users?.some(checkRowOrUser) || false;
        const sectionsPass = row.sections?.some(section =>
            section.users?.length > 0 && section.users.some(checkRowOrUser)
        ) || false;
        return usersPass || sectionsPass;
        }

        if (row?.type === "section") {
        return row.users?.length > 0 && row.users.some(checkRowOrUser);
        }

        return checkRowOrUser(row);
  };