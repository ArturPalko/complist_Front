import { useEffect, useMemo, useState } from "react";
import {
  selectSectionsById,
  selectUsersBySection,
  selectUsersByDepartment,
  selectPhonesByUserId,
  selectDictionaryByType,
  selectAllUsers,
  activeMenu,
} from "../../../redux/selectors/selector";
import { useDispatch, useSelector } from "react-redux";
import BindPhonesToUserView from "./BindPhonesToUserView/BindPhonesToUserView";
import { setDataIsLoadedActionCreator } from "../../../redux/reducers/app-reducer";
import { fetchDictionariesThunk } from "../../../dal/api";

const EMPTY_PHONE_VALUES = {
  landline: "",
  internal: "",
  cisco: "",
};

export default function BindPhonesToUser({onSubmit, onClose, deprs }) {
  const [departmentId, setDepartmentId] = useState("");
  const [sectionId, setSectionId] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [showTransfer, setShowTransfer] = useState(false);
  const [transferId, settransferId] = useState("");

  const [status, setStatus] = useState("");

  const [phoneValues, setPhoneValues] = useState(
    EMPTY_PHONE_VALUES
  );


 const dispatch = useDispatch();
  const menu = useSelector(activeMenu)



  const departments = useMemo(
    () => deprs.flatMap((page) => page.rows ?? []),
    [deprs]
  );

  const selectedDepartment = useMemo(
    () =>
      departments.find(
        (item) =>
          String(item.departmentId) === String(departmentId)
      ),
    [departments, departmentId]
  );

  const sectionsPages = useSelector(
    selectSectionsById(
      departmentId ? Number(departmentId) : null
    )
  );

  const sections = useMemo(
    () => sectionsPages.flatMap((page) => page.rows ?? []),
    [sectionsPages]
  );

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
          Number(user.id) === Number(selectedUserId)
      ),
    [users, selectedUserId]
  );

  const userPhones = useSelector(
    selectPhonesByUserId(selectedUserId)
  );
console.log("userPhones:::",userPhones)
  const landlines = useSelector(
    selectDictionaryByType("landline", "phones")
  );

  const internals = useSelector(
    selectDictionaryByType("internal", "phones")
  );

  const ciscos = useSelector(
    selectDictionaryByType("cisco", "phones")
  );

  const phoneOptions = useMemo(
    () => ({
      landline: landlines.flatMap(
        (page) => page.rows ?? []
      ),
      internal: internals.flatMap(
        (page) => page.rows ?? []
      ),
      cisco: ciscos.flatMap(
        (page) => page.rows ?? []
      ),
    }),
    [landlines, internals, ciscos]
  );

  const hasPhone = (userId, phoneType) => {
    return phoneOptions[phoneType]?.some((phone) =>
      phone.users?.some(
        (phoneUser) =>
          Number(phoneUser.id) === Number(userId)
      )
    );
  };

  const transferUsers = useMemo(
    () =>
      allUsers.filter(
        (user) =>
          Number(user.id) !== Number(selectedUserId) &&
          user.name
      ),
    [allUsers, selectedUserId]
  );

  useEffect(() => {
    if (!selectedUserId) {
      setPhoneValues(EMPTY_PHONE_VALUES);
      return;
    }

   setPhoneValues({
  landline: userPhones?.landline || "",
  internal: userPhones?.internal || "",
  cisco: userPhones?.cisco || "",
});
  }, [selectedUserId]);

  const handleDepartmentChange = (event) => {
    const value = event.target.value;

    setDepartmentId(value);
    setSectionId("all");
    setSelectedUserId(null);

    setShowTransfer(false);
    settransferId("");
    setStatus("");
    setPhoneValues(EMPTY_PHONE_VALUES);
  };

  const handleSectionChange = (event) => {
    setSectionId(event.target.value);
    setSelectedUserId(null);

    setShowTransfer(false);
    settransferId("");
    setStatus("");
    setPhoneValues(EMPTY_PHONE_VALUES);
  };

  const handleSelectUser = (user) => {
    setSelectedUserId(user.id);

    setShowTransfer(false);
    settransferId("");
    setStatus("");
  };

  const handlePhoneChange = (type, value) => {
    setPhoneValues((prev) => ({
      ...prev,
      [type]: value,
    }));

    setStatus("");
  };

  const handleClearPhone = (type) => {
  setPhoneValues((prev) => ({
    ...prev,
    [type]: "",
  }));


    setStatus(
      `Значення ${type} буде очищено після збереження.`
    );
  };

  const handleUnbindAll = () => {
    if (!selectedUser) return;

    setPhoneValues(EMPTY_PHONE_VALUES);

    setStatus(
      "Усі телефони буде відв'язано після збереження."
    );
  };

const handleSave = async () => {
  if (!selectedUser) return;

  const data = {
    userId: selectedUser.id,
    phones: phoneValues,
    transferId: transferId || null,
  };

  console.log("sendData:::", data);

  await  onSubmit(data);
       dispatch(
            setDataIsLoadedActionCreator(
              false,
              menu
            )
          );
           dispatch(fetchDictionariesThunk());
    // onClose();

};

  return (
    <BindPhonesToUserView
      onClose={onClose}
      departments={departments}
      departmentId={departmentId}
      sectionId={sectionId}
      selectedDepartment={selectedDepartment}
      sections={sections}
      onDepartmentChange={handleDepartmentChange}
      onSectionChange={handleSectionChange}
      users={users}
      selectedUserId={selectedUserId}
      onSelectUser={handleSelectUser}
      hasPhone={hasPhone}
      selectedUser={selectedUser}
      phoneOptions={phoneOptions}
      phoneValues={phoneValues}
      onPhoneChange={handlePhoneChange}
      onClearPhone={handleClearPhone}
      showTransfer={showTransfer}
      onToggleTransfer={() => {
        setShowTransfer((value) => !value);
        settransferId("");
      }}
      transferUsers={transferUsers}
      transferId={transferId}
      onTransferUserChange={settransferId}
      status={status}
      onUnbindAll={handleUnbindAll}
      onSave={handleSave}
    />
  );
}