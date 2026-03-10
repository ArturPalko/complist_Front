 export const setupModalBehavior = (onClose) => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    document.body.classList.add("modal-open"); // блокуємо скрол

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.classList.remove("modal-open"); // розблоковуємо скрол
    };
  };