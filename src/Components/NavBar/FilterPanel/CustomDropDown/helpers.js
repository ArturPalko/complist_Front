export const toggleAll = (items, allSelected, toggleFunc) => {
  items.forEach(item => {
    if (allSelected) {
      if (selectedKeys.includes(item)) toggleFunc(item);
    } else {
      if (!selectedKeys.includes(item)) toggleFunc(item);
    }
  });
};
