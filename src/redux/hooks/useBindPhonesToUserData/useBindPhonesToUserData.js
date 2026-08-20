import { useMemo } from "react";
import { useSelector } from "react-redux";

import {
  selectSectionsById,
  selectUsersBySection,
  selectUsersByDepartment,
  selectPhonesByUserId,
  selectDictionaryByType,
  selectAllUsers,
} from "../../selectors/selector";


import {
  flattenPages,
  getPhoneOptions,
  hasPhoneForUser,
  getTransferUsers,
} from "./helpers";

export default function useBindPhonesToUserData({
  deprs,
  departmentId,
  sectionId,
  selectedUserId,
}) {
  // ==============================
  // DEPARTMENTS
  // ==============================

  const departments = useMemo(
    () => flattenPages(deprs),
    [deprs]
  );

  const selectedDepartment = useMemo(
    () =>
      departments.find(
        (item) =>
          String(item.departmentId) ===
          String(departmentId)
      ),
    [departments, departmentId]
  );

  // ==============================
  // SECTIONS
  // ==============================

  const sectionsPages = useSelector(
    selectSectionsById(
      departmentId
        ? Number(departmentId)
        : null
    )
  );

  const sections = useMemo(
    () => flattenPages(sectionsPages),
    [sectionsPages]
  );

  // ==============================
  // USERS
  // ==============================

  const users = useSelector(
    sectionId !== "all"
      ? selectUsersBySection(
          Number(departmentId),
          Number(sectionId)
        )
      : selectUsersByDepartment(
          Number(departmentId)
        )
  );

  const allUsers = useSelector(selectAllUsers);

  const selectedUser = useMemo(
    () =>
      users.find(
        (user) =>
          Number(user.id) ===
          Number(selectedUserId)
      ),
    [users, selectedUserId]
  );

  // ==============================
  // USER PHONES
  // ==============================

  const userPhones = useSelector(
    selectPhonesByUserId(selectedUserId)
  );

  // ==============================
  // PHONE DICTIONARIES
  // ==============================

  const landlines = useSelector(
    selectDictionaryByType(
      "landline",
      "phones"
    )
  );

  const internals = useSelector(
    selectDictionaryByType(
      "internal",
      "phones"
    )
  );

  const ciscos = useSelector(
    selectDictionaryByType(
      "cisco",
      "phones"
    )
  );

  // ==============================
  // PHONE OPTIONS
  // ==============================

  const phoneOptions = useMemo(
    () =>
      getPhoneOptions(
        landlines,
        internals,
        ciscos
      ),
    [
      landlines,
      internals,
      ciscos,
    ]
  );

  // ==============================
  // HAS PHONE
  // ==============================

  const hasPhone = (userId, phoneType) =>
    hasPhoneForUser(
      phoneOptions,
      userId,
      phoneType
    );

  // ==============================
  // TRANSFER USERS
  // ==============================

  const transferUsers = useMemo(
    () =>
      getTransferUsers(
        allUsers,
        selectedUserId
      ),
    [
      allUsers,
      selectedUserId,
    ]
  );

  // ==============================
  // RETURN
  // ==============================

  return {
    departments,
    selectedDepartment,

    sections,

    users,
    selectedUser,

    userPhones,

    phoneOptions,
    hasPhone,

    transferUsers,
  };
}