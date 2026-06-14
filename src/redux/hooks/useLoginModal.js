import { useLocation, useNavigate } from "react-router-dom";

export const useModal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);

  const modal = query.get("modal");

  // відкриття будь-якої модалки
  const openModal = (type) => {
    const newQuery = new URLSearchParams(location.search);
    newQuery.set("modal", type);

    navigate({ search: newQuery.toString() }, { replace: true });
  };

  // закриття модалки
  const closeModal = () => {
    const newQuery = new URLSearchParams(location.search);
    newQuery.delete("modal");

    navigate({ search: newQuery.toString() }, { replace: true });
  };

  return {
    modal,          // який тип модалки зараз відкритий
    isOpen: !!modal, // будь-яка модалка відкрита
    openModal,
    closeModal,
  };
};