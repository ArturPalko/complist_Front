import { syncHideState } from "../syncHideState";

const isSelected = value =>
  Array.isArray(value) ? value.length > 0 : Boolean(value);

const addToOrder = (order, key) =>
  order.includes(key) ? order : [...order, key];

const removeFromOrder = (order, key) =>
  order.filter(d => d !== key);

export const resolveBookmarkState = ({
  bookmarks,
  deptName,
  nextSelectedSubDepts
}) => {
  const hasSelection = isSelected(nextSelectedSubDepts[deptName]);

  const selectedOrder = hasSelection
    ? addToOrder(bookmarks.selectedOrder, deptName)
    : removeFromOrder(bookmarks.selectedOrder, deptName);

  const { hideUsersWithoutSections, hideSections } =
    syncHideState(bookmarks, deptName, hasSelection);

  return {
    selectedOrder,
    hideUsersWithoutSections,
    hideSections
  };
};