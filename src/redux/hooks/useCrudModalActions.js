import { useSelector } from "react-redux";
import { useDragContext, useModalWindowContext } from "../contexts/useConetxt";
import { CRUD_CONFIG } from "../../configs/app/crudConfig";
import { entityMap } from "../../configs/app/enitiyMap";

import {
  selectPositionsDictionary,
  selectSectionsById,
  selectAtiveDepartmentId,
  selectDictionaryByType,
} from "../selectors/selector";

export const useCrudModalActions = (modalType) => {
  const { selectedIds } = useDragContext();
  const { openModal } = useModalWindowContext();

  const depr = useSelector(selectAtiveDepartmentId);
  const positions = useSelector(selectPositionsDictionary);
  const sections = useSelector(selectSectionsById(depr));
  const departments = useSelector(selectDictionaryByType("departments"))
  const landlines = useSelector(selectDictionaryByType("landline", "phones"))
   const internals = useSelector(selectDictionaryByType("internal", "phones"))
   const ciscos = useSelector(selectDictionaryByType("cisco", "phones"))
           
  

  const config = CRUD_CONFIG[modalType];
  const entity = entityMap[modalType];

  const sources = {
    position:positions,
    section:sections,
    department:departments,
    landline:landlines,
    internal:internals,
    cisco:ciscos
  };

  // ---------------- ADD ----------------
  const add = () => {
             
    // console.log("DEPR:",depr)
             
    if (!config) return;
debugger
    const data =
      modalType === "section"
        ? { departmentId: depr }
        : null;
if (modalType === "section" && !data.departmentId) return
    openModal({
      type: modalType,
      mode: "add",
      data,
    });
  };

  // ---------------- DELETE ----------------
  const remove = () => {
    if (!config || !selectedIds?.length) return;

    openModal({
      type: modalType,
      mode: "delete",
      data: selectedIds,
    });
  };

  // ---------------- EDIT ----------------
  const edit = () => {
             
    if (!config || !entity || !selectedIds?.length) return;

    const id = selectedIds[0];
    const list = sources[modalType];

    const item = list
      ?.flatMap((p) => p.rows ?? [])
      .find((r) => r?.[entity.id] === id);
         
    openModal({
      type: modalType,
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