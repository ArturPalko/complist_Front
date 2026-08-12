import { useSelector } from "react-redux";

import { useModalWindowContext, useDragContext } from "../contexts/useConetxt"; 
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

  const positions = useSelector(selectPositionsDictionary);

  const sections = useSelector(
    selectSectionsById(activeDep)
  );

  const departments = useSelector(
    selectDictionaryByType("departments")
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

  const menu = useSelector(activeMenu);

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

  const config = CRUD_CONFIG[currentModalType];
  const entity = entityMap[currentModalType];

  const sources = {
    position: positions,
    section: sections,
    department: departments,
    landline: landlines,
    internal: internals,
    cisco: ciscos,
  };

  // ---------------- ADD ----------------

  const add = () => {
    const data =
      currentModalType === "section"
        ? { departmentId: activeDep }
        : null;

    if (
      currentModalType === "section" &&
      !data.departmentId
    ) {
      return;
    }

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
        .flatMap((page) => page.rows)
        .find(
          (row) =>
            Number(row.id) === Number(id)
        );
    } else {
      item = sources[currentModalType]
        ?.flatMap((page) => page.rows ?? [])
        .find(
          (row) =>
            Number(row?.[entity.id]) === Number(id)
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