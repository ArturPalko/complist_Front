import { syncHideState } from "../syncHideState";

const isSelected = value =>
  Array.isArray(value) ? value.length > 0 : Boolean(value);

const addToOrder = (order, key) =>
  order.includes(key) ? order : [...order, key];

export const resolveBulkBookmarkState = ({
  bookmarks,
  selectedSubDepts
}) => {
  let selectedOrder = [];
  let hideUsersWithoutSections = {};
  let hideSections = {};

  Object.entries(selectedSubDepts).forEach(([deptName, value]) => {
    const hasSelection = isSelected(value);

    selectedOrder = addToOrder(selectedOrder, deptName);

    const hide = syncHideState(bookmarks, deptName, hasSelection);

    hideUsersWithoutSections = {
      ...hideUsersWithoutSections,
      ...hide.hideUsersWithoutSections
    };

    hideSections = {
      ...hideSections,
      ...hide.hideSections
    };
  });

  return {
    selectedOrder,
    hideUsersWithoutSections,
    hideSections
  };
};