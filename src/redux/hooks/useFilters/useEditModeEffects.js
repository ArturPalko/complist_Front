import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { isEditModeSelected, activeMenu } from "../../selectors/selector";
import { redirectToPage } from "../../../shared/functions/redirectToPage";

export const useEditModeEffects = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const editMode = useSelector(isEditModeSelected);
  const active = useSelector(activeMenu);

  const prevEditRef = useRef(editMode);

  useEffect(() => {
    const prev = prevEditRef.current;

    // нічого не змінилось
    if (prev === editMode) return;

    prevEditRef.current = editMode;

    // реагуємо тільки коли ВКЛЮЧИЛИ edit mode
    if (!editMode) return;

    const pathParts = location.pathname.split("/").filter(Boolean);

    const pageName = pathParts[0];
    if (!pageName) return;

    // вже на першій сторінці — нічого не робимо
    const isAlreadyPage1 = pathParts.includes("1");
    if (isAlreadyPage1) return;

    redirectToPage({
      navigate,
      currentPage: 1,
      activeMenu: active || pageName,
    });
  }, [editMode, location.pathname, navigate, active]);
};