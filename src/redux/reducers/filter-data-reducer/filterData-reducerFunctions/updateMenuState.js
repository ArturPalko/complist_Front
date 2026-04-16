export const updateMenuState = (state, menu, updater) => ({
  ...state,
  [menu]: updater(state[menu])
});