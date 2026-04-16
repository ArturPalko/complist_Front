export const syncHideState = (bookmarks, deptName, hasSelection) => {
  const hideUsersWithoutSections = { ...bookmarks.hideUsersWithoutSections };
  const hideSections = { ...bookmarks.hideSections };

  if (bookmarks.allHideUsersWithoutSections && hasSelection) {
    hideUsersWithoutSections[deptName] = true;
  } else {
    delete hideUsersWithoutSections[deptName];
  }

  if (bookmarks.allHideSections && hasSelection) {
    hideSections[deptName] = true;
  } else {
    delete hideSections[deptName];
  }

  return { hideUsersWithoutSections, hideSections };
};