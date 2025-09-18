import { useParams } from "react-router-dom";

export const usePageNumber = () => {
  const params = useParams();
  return Number(params.pageNumber) || 1;
};
