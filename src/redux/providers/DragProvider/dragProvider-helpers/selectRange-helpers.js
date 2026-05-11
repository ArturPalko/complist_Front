export const getSelectionSource = ({
  lastPage,
  foundResults,
  fullData,
}) => {
  return lastPage === "foundResults"
    ? foundResults
    : fullData;
};

export const getRangeIndexes = (
  source,
  startId,
  endId
) => {
  const start = source.findIndex(i => i.id === startId);
  const end = source.findIndex(i => i.id === endId);

  if (start === -1 || end === -1) {
    return null;
  }

  return start < end
    ? [start, end]
    : [end, start];
};

export const buildRangeIds = (
  source,
  from,
  to
) => {
  return source
    .slice(from, to + 1)
    .map(i => i.id);
};