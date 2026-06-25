import React, { useState } from "react";
import styles from "./DropZone.module.css";

export const DropZone = ({
  onDrop,
  showDropZones,
  position = "top",
}) => {
  const [isOver, setIsOver] = useState(false);

  if (!showDropZones) return null;

  const isTop = position === "top";

  return (
    <tr
      className={`${styles.dropZone} ${isOver ? styles.active : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        onDrop?.(e);
      }}
    >
      <td colSpan={1000}>
        <div className={styles.zone}>
          <div className={styles.line} />

          <div
            className={`${styles.label} ${
              isTop ? styles.top : styles.bottom
            }`}
          >
            {isTop ? "↑ Наверх" : "↓ Вниз"}
          </div>
        </div>
      </td>
    </tr>
  );
};