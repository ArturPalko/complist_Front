// filters.builders.js
export const buildNegativeConditions = (conditions) =>
  Object.fromEntries(
    Object.entries(conditions).map(([key, fn]) => [
      `NOT${key[0].toUpperCase()}${key.slice(1)}`,
      (el) => !fn(el),
    ])
  );

export const buildAutoGroups = (keys) =>
  Object.fromEntries(
    keys.map((key) => [
      key,
      [`NOT${key[0].toUpperCase()}${key.slice(1)}`],
    ])
  );

export const buildFilterPointsForPage = ({
  keys,
  ownerKeys,
  labels,
  withNegative,
  groupNames,
}) => {
  const owner = keys
    .filter((k) => ownerKeys.includes(k))
    .map((k) => ({ key: k, label: labels[k] }));

  const positive = keys
    .filter((k) => withNegative[k])
    .map((k) => ({ key: k, label: labels[k] }));

  const negative = positive.map(({ key }) => ({
    key: `NOT${key[0].toUpperCase()}${key.slice(1)}`,
    label: `(НЕ) ${labels[key]}`,
  }));

  const result = {};
  if (owner.length) result[groupNames.OWNER] = owner;
  if (positive.length) result[groupNames.POSITIVE] = positive;
  if (negative.length) result[groupNames.NEGATIVE] = negative;

  return result;
};
