import redArrow from "../../../assets/red_arrow.png"
import styles from "./IndexCell.module.css"


import { useIndexCellContext } from "./IndexCellContext";
import { useIndexCellLogic } from "./useIndexCellLogic";

export const IndexCell = ({ index }) => {

  const { indexDataOfFoundResultsForFoundResultsPage, pageName } =
    useIndexCellContext();

  // Використовуємо хук логіки для конкретного рядка
  const {
    cellData,
    hoveredRow,
    clickedRow,
    rowRef,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
  } = useIndexCellLogic(index, indexDataOfFoundResultsForFoundResultsPage, pageName);

  if (!cellData) return null;

  return (
    <td
      className={styles.cell}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className={styles.cellContent}>
        <span className={`${styles.text} ${hoveredRow ? styles.hideText : ""}`}>
          Сторінка: {cellData.currentPage}, Стрічка: {cellData.index}
        </span>
        <img
          ref={rowRef}
          src={redArrow}
          alt="arrow"
          className={`
            ${styles.arrow}
            ${hoveredRow ? styles.showArrow : ""}
            ${clickedRow ? styles.moveRight : ""}
          `}
        />
      </div>
    </td>
  );
};
