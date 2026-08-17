import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import s from "./PhonesTable.module.css";
import { useCrudModalActions } from "../../../../redux/hooks/useCrudModalActions";
import {
  getCurrentMode,
  activeMenu,
} from "../../../../redux/selectors/selector";

import {
  handleOnOpenSectionsButtonClick,
  hasItems,
  getItemsCount,
  shouldShowActionButton,
} from "./phonesTableHelpers";

export const GroupRowActions = ({
  row,
  isSections,
  isAddUsers,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const modalType = useSelector(getCurrentMode);
  const currentMenu = useSelector(activeMenu);

  const { add } = useCrudModalActions(modalType);

  const handleClick = (e) => {
    e.stopPropagation();

    handleOnOpenSectionsButtonClick({
      rowType: row.type,
      isSections,
      isAddUsers,
      item: row,
      dispatch,
      navigate,
      currentMenu,
      currentMode: modalType,
    })(e);
  };

  if (!shouldShowActionButton(row, isSections, isAddUsers)) {
    return null;
  }

  if (hasItems(row, isAddUsers)) {
    return (
      <div className={s.groupRowActions}>
        <span className={s.sectionsCount}>
          ({getItemsCount(row, isAddUsers)})
        </span>

        <button onClick={handleClick}>
          Переглянути
        </button>
      </div>
    );
  }

  return (
    <div className={s.groupRowActions}>
      <button
        className={s.addButton}
        onClick={(e) => {
          handleClick(e);
          add();
        }}
      >
        + Додати
      </button>
    </div>
  );
};