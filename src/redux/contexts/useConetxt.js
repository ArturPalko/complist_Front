import { createContext, useContext } from "react";

/**
 * Фабрика створення контексту з дефолтним значенням
 * Повертає [Context, useHook]
 */
export const createCtx = (defaultValue) => {
  const ctx = createContext(undefined);

  const useCtx = () => {
    const context = useContext(ctx);
    // повертаємо дефолтне значення, якщо Provider відсутній
    return context ?? defaultValue;
  };

  return [ctx, useCtx];
};

// ==============================
// Контексти з дефолтними значеннями
// ==============================

// PageContext
export const [PageContext, usePageContext] = createCtx({
  titleRef: null,
  columns: [],
  rowsPerPage: 0,
  pageNumber: 1,
  pageName: "",
  indexesOfFoundResultsForCurrentPage: [],
});

// FoundResultsContext
export const [FoundResultsContext, useFoundResults] = createCtx({
  foundResults: [],
  indexDataOfFoundResultsForFoundResultsPage: [],
  pageName: "",
});

// DataLoaderContext
export const [DataLoaderContext, useDataLoader] = createCtx({
  isLoading: false,
  loadData: () => {},
});

// SearchToggleContext
export const [SearchToggleContext, useSearchToggle] = createCtx({
  valueOfSearchCheckBox: false,
  handleToggleSearchField: () => {},
});

// PasswordsToggleContext
export const [PasswordsToggleContext, usePasswordsToggle] = createCtx({
  valueOfpasswordCheckbox: false,
  handleTogglePasswords: () => {},
});