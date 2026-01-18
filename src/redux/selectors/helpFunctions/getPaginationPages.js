export const getPaginationPages = (state, activeMenu) => {
  if (activeMenu === "phones") {
    return state.data?.phones
  }

  return state.mails?.[activeMenu];
};
