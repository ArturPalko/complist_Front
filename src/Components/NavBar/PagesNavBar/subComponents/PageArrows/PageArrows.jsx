import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import s from "./PageArrows.module.css";

export default function PageArrows({
  basePath,
  count,
  disabled = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const base = basePath.endsWith("/")
    ? basePath
    : `${basePath}/`;

  const currentPage = Number(
    location.pathname
      .slice(base.length)
      .split("/")[0]
  ) || 1;

  const goToPrevious = () => {
    if (currentPage <= 1) return;

    navigate(
      `${basePath}${currentPage - 1}`
    );
  };

  const goToNext = () => {
    if (currentPage >= count) return;

    navigate(
      `${basePath}${currentPage + 1}`
    );
  };

  return (
    <div
      className={`${s.wrapper} ${
        disabled ? s.hidden : ""
      }`}
    >
      <button
        type="button"
        className={s.arrow}
        disabled={currentPage <= 1}
        onClick={goToPrevious}
        aria-label="Попередня сторінка"
      >
        ←
      </button>

      <button
        type="button"
        className={s.arrow}
        disabled={currentPage >= count}
        onClick={goToNext}
        aria-label="Наступна сторінка"
      >
        →
      </button>
    </div>
  );
}

