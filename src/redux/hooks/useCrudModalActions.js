import { useSelector } from "react-redux";
import { useDragContext, useModalWindowContext } from "../contexts/useConetxt";
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
  getDataForMenu,
} from "../selectors/selector";

export const useCrudModalActions = (modalType) => {
  const { selectedIds } = useDragContext();
  const { openModal } = useModalWindowContext();


  const activeDep = useSelector(selectAtiveDepartmentId);
  const activeSec = useSelector(selectActiveSectionId);

  const positions = useSelector(selectPositionsDictionary);
  const sections = useSelector(selectSectionsById(activeDep));
  const departments = useSelector(selectDictionaryByType("departments"));
  const landlines = useSelector(selectDictionaryByType("landline", "phones"));
  const internals = useSelector(selectDictionaryByType("internal", "phones"));
  const ciscos = useSelector(selectDictionaryByType("cisco", "phones"));
 const menu = useSelector(activeMenu);
 const dataForMenu = useSelector(state => getDataForMenu(state, menu))
  const users = useSelector(
    activeSec
      ? selectUsersBySection(activeDep, activeSec)
      : selectUsersByDepartment(activeDep)
  );

  const config = CRUD_CONFIG[modalType];
  const entity = entityMap[modalType];

  const sources = {
    position: positions,
    section: sections,
    department: departments,
    landline: landlines,
    internal: internals,
    cisco: ciscos,
  };
if (menu == "Lotus"){
  modalType = "mailsToUsers"
}
if (menu == "Gov-ua"){
  modalType = "mailsToUsersGovua"
}
  // ---------------- ADD ----------------
  const add = () => {
       
    // if (!config) return;

    const data =
      modalType === "section"
        ? { departmentId: activeDep }
        : null;

    if (modalType === "section" && !data.departmentId) return;

    openModal({
      type: modalType,
      mode: "add",
      data,
    });
  };

  // ---------------- DELETE ----------------
  const remove = () => {
       
    // if (!config || !selectedIds?.length) return;
    if ( !selectedIds?.length) return;
   
    openModal({
      type: modalType,
      mode: "delete",
      data: selectedIds,
    });
  };

  // ---------------- EDIT ----------------
  const edit = () => {
    console.log("EDIT CALLED", Date.now());
               debugger
    // if (!config || !selectedIds?.length) return;
        if ( !selectedIds?.length) return;
   

    const id = selectedIds[0];

    let item;
   
    // Редагування користувачів
    if (activeDep) {
      item = users.find(user => Number(user.id) === Number(id));
    }
    else {
      // if (!entity) return;
       
     let list;
let item;
debugger
if (modalType === "mailsToUsers" || modalType == "mailsToUsersGovua") {
     debugger
  list = dataForMenu;
   console.log("id", id);
console.log("dataForMenu", dataForMenu);
console.log(
  "flat",
  dataForMenu.flatMap(page => page.rows)
);
debugger
  item = dataForMenu
    .flatMap(page => page.rows)
    .find(row => Number(row.id) === Number(id));
} else {
  list = sources[modalType];

  item = list
    ?.flatMap(p => p.rows ?? [])
    .find(r => Number(r?.[entity.id]) === Number(id));
}
     
   
  //     item = list
  //       ?.flatMap(p => p.rows ?? [])
  //       .find(r => Number(r?.[entity.id]) === Number(id));
  //   }
   
    openModal({
      type: modalType,
      mode: "edit",
      data: item,
    });
  };
}

  return {
    add,
    edit,
    remove,
  };
};
