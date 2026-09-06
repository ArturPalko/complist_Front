import { useSelector } from "react-redux";

import {
  useModalWindowContext,
  useDragContext,
} from "../contexts/useConetxt";

import { CRUD_CONFIG } from "../../configs/app/crudConfig";
import { entityMap } from "../../configs/app/enitiyMap";

import {
  selectPositionsDictionary,
  selectSectionsById,
  selectAtiveDepartmentId,
  selectDictionaryByType,
  selectActiveSectionId,
  selectUsersBySection,
  selectUsersByDepartment,
  activeMenu,
  getCurrentMode,
  getDataForMenu,
  addUsersModeSelected,
} from "../selectors/selector";

export const useCrudModalActions = (modalType) => {
  const { selectedIds } = useDragContext();
  const { openModal } = useModalWindowContext();

  const activeDep = useSelector(selectAtiveDepartmentId);
  const activeSec = useSelector(selectActiveSectionId);

  const currentMode = useSelector(getCurrentMode);
  const menu = useSelector(activeMenu);

  const positions = useSelector(
    selectPositionsDictionary
  );

  const sections = useSelector(
    selectSectionsById(activeDep)
  );

  const departments = useSelector(
    selectDictionaryByType("departments")
  );

  const userTypes = useSelector(
    selectDictionaryByType("userTypes")
  );

  const landlines = useSelector(
    selectDictionaryByType("landline", "phones")
  );

  const internals = useSelector(
    selectDictionaryByType("internal", "phones")
  );

  const ciscos = useSelector(
    selectDictionaryByType("cisco", "phones")
  );

  const dataForMenu = useSelector((state) =>
    getDataForMenu(state, menu)
  );

  const users = useSelector(
    activeSec
      ? selectUsersBySection(activeDep, activeSec)
      : selectUsersByDepartment(activeDep)
  );

  const isAddUsers = useSelector(
    addUsersModeSelected
  );

  const isDictionaryMode = Boolean(currentMode);

  // =========================
  // Modal type
  // =========================

  const currentModalType =
    !isDictionaryMode &&
    (menu === "Lotus" || menu === "Gov-ua")
      ? "mailsToUsers"
      : !isDictionaryMode &&
          menu === "phones"
        ? "phonesToUsers"
        : modalType;

  const entityTypeMap = {
    positions: "position",
    departments: "department",
    sections: "section",
    userTypes: "userType",
  };

  const entityType =
    entityTypeMap[currentModalType] ??
    currentModalType;

  const config = CRUD_CONFIG[currentModalType];
  const entity = entityMap[entityType];

  const sources = {
    positions,
    departments,
    sections,
    userTypes,
    landline: landlines,
    internal: internals,
    cisco: ciscos,
  };

  // =========================
  // Selected rows check
  // =========================

  const checkSelectedRows = () => {
    if (selectedIds?.length) return true;

    alert(
      "Спочатку обери рядок.\n\n" +
      "Одиничний вибір — Ctrl + Left Click.\n\n" +
      "Вибір діапазону — Alt + Left Click по двох рядках " +
      "на одній сторінці.\n\n" +
      "Щоб скасувати весь вибір — натисни Escape.\n\n" +
      "Щоб скасувати окремий вибір — повторно обери вже активний рядок."
    );

    return false;
  };

  // =========================
  // ADD
  // =========================

  const add = (data = null) => {
    const modalData =
      currentModalType === "sections"
        ? {
            departmentId:
              data?.departmentId ?? activeDep,
          }
        : data;

    openModal({
      type: currentModalType,
      mode: "add",
      data: modalData,
    });
  };

  // =========================
  // DELETE
  // =========================

  const remove = () => {
    if (!checkSelectedRows()) return;

    openModal({
      type: currentModalType,
      mode: "delete",
      data: selectedIds,
    });
  };

  // =========================
  // EDIT
  // =========================

  const edit = () => {
    if (!checkSelectedRows()) return;

    const id = selectedIds[0];

    let item;

    if (activeDep && isAddUsers) {
      item = users
        ?.flatMap(
          (page) => page.rows ?? []
        )
        .find(
          (user) =>
            Number(user.id) === Number(id)
        );
    } else if (
      currentModalType === "mailsToUsers"
    ) {
      item = dataForMenu
        .flatMap(
          (page) => page.rows ?? []
        )
        .find(
          (row) =>
            Number(row.id) === Number(id)
        );
    } else {
      item = sources[currentModalType]
        ?.flatMap(
          (page) => page.rows ?? []
        )
        .find(
          (row) =>
            Number(row?.[entity?.id]) ===
            Number(id)
        );
    }

    openModal({
      type: currentModalType,
      mode: "edit",
      data: item,
    });
  };

  // =========================
  // TRANSFER USERS
  // =========================

  const transfer = () => {
    if (!checkSelectedRows()) return;

    openModal({
      type: "transferUser",
      mode: "add",
      data: selectedIds,
    });
  };

  // =========================
  // CHANGE USER STATUS
  // =========================

  const changeStatus = (data) => {
    if (!checkSelectedRows()) return;

    openModal({
      type: "userStatus",
      mode: "add",
      data: data,
    });
  };

  return {
    add,
    edit,
    remove,
    transfer,
    changeStatus,
  };
};

