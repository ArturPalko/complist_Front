import { useLocation, useNavigate } from "react-router-dom";

export const useLoginModal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const isLoginOpen = query.get("login") === "true";

  const openModal = () => {
    const newQuery = new URLSearchParams(location.search);
    newQuery.set("login", "true");
    navigate({ search: newQuery.toString() }, { replace: true });
  };

  const closeModal = () => {
    const newQuery = new URLSearchParams(location.search);
    newQuery.delete("login");
    navigate({ search: newQuery.toString() }, { replace: true });
  };

  return { isLoginOpen, openModal, closeModal };
};