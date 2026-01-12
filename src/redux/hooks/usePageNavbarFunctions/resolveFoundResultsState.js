export const resolveFoundResultsState = ({
  active,
  isPhonesFound,
  isLotusFound,
  isGovUaFound,
  foundResults,
  keysToKeep
}) => {
  const isFound =
    (active === "phones" && isPhonesFound) ||
    (active === "Lotus" && isLotusFound) ||
    (active === "Gov-ua" && isGovUaFound);

  if (!isFound) {
    return {
      showFoundResultsPage: false,
      indexes: []
    };
  }

  const index = foundResults.map(result =>
    Object.fromEntries(
      Object.entries(result).filter(([k]) => keysToKeep.includes(k))
    )
  );

  const indexes = Object.values(index).map(obj => Object.values(obj));

  return {
    showFoundResultsPage: true,
    indexes
  };
};
