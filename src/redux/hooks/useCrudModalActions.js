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

  const positions = useSelector(selectPositionsDictionary);

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

  const isAddUsers = useSelector(addUsersModeSelected);

  const isDictionaryMode = Boolean(currentMode);

  const currentModalType =
    !isDictionaryMode &&
    (menu === "Lotus" || menu === "Gov-ua")
      ? "mailsToUsers"
      : modalType;

  const entityTypeMap = {
    positions: "position",
    departments: "department",
    sections: "section",
    userTypes: "userType",
  };

  const entityType =
    entityTypeMap[currentModalType] ?? currentModalType;

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

  // ---------------- ADD ----------------

  const add = () => {
    const data =
      currentModalType === "sections"
        ? { departmentId: activeDep }
        : null;
  
    openModal({
      type: currentModalType,
      mode: "add",
      data,
    });
  };

  // ---------------- DELETE ----------------

  const remove = () => {
    if (!selectedIds?.length) return;

    openModal({
      type: currentModalType,
      mode: "delete",
      data: selectedIds,
    });
  };

  // ---------------- EDIT ----------------

  const edit = () => {
    if (!selectedIds?.length) return;

    const id = selectedIds[0];
    let item;

    if (activeDep && isAddUsers) {
      item = users.find(
        (user) => Number(user.id) === Number(id)
      );
    } else if (currentModalType === "mailsToUsers") {
      item = dataForMenu
        .flatMap((page) => page.rows ?? [])
        .find(
          (row) => Number(row.id) === Number(id)
        );
    } else {
      item = sources[currentModalType]
        ?.flatMap((page) => page.rows ?? [])
        .find(
          (row) =>
            Number(row?.[entity?.id]) === Number(id)
        );
    }

    openModal({
      type: currentModalType,
      mode: "edit",
      data: item,
    });
  };

  return {
    add,
    edit,
    remove,
  };
};