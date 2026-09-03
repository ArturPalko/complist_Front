export const sortData = (
  data,
  key,
  direction,
  locale = "uk"
) => {
  return [...data].sort((a, b) => {
    let aValue = a[key] ?? "";
    let bValue = b[key] ?? "";

    if (key === "usersCount") {
      aValue = a.users?.length ?? 0;
      bValue = b.users?.length ?? 0;
    }

    const result =
      String(aValue).localeCompare(
        String(bValue),
        locale,
        {
          sensitivity: "base",
          numeric: true,
        }
      );

    return direction === "asc"
      ? result
      : -result;
  });
};