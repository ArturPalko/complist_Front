import { useDispatch, useSelector } from "react-redux";

import {
  isSectionsMode,
  isDepartmentsMode,
  isPositionsMode,
  isUserTypesMode,
  getCurrentMode,
  addUsersModeSelected,
  selectAtiveDepartmentId,
  getDictionaryPages,
  getCurrentPageNumberByKey,
  activeMenu
} from "../../../redux/selectors/selector";

import {
  setPhonesViewMode,
  clearUnsavedOrder,
  toggleaddUsersMode
} from "../../../redux/reducers/ui-reducer";

import { changeOrderOfDisplayElements } from "../../../dal/api";
import { setDataIsLoadedActionCreator } from "../../../redux/reducers/app-reducer";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { pageConfigs } from "../../../configs/app/pageConfig";
import { handleRedirectWhenModeCleared } from "./helpers";
import BottomTableControlsView from "./BottomTableControlsView";

const BottomTableControls = () => {
  const dispatch = useDispatch();

  const isSections = useSelector(isSectionsMode);
  const activeDep = useSelector(selectAtiveDepartmentId);
  const isDepartments = useSelector(isDepartmentsMode);
  const isPosition = useSelector(isPositionsMode);
  const isUserTypes = useSelector(isUserTypesMode);
  const mode = useSelector(getCurrentMode);
  const isAddUsers = useSelector(addUsersModeSelected);
  const navigate = useNavigate()
  const phoneTypes = ["landline", "internal", "cisco"];

  const selectedPhoneType = phoneTypes.includes(mode)
    ? mode
    : "";

  const unsavedOrder = useSelector(
    (state) => state.ui.unsavedOrder
  );




const dictionaryPages = useSelector(getDictionaryPages);

const currentMode = useSelector(getCurrentMode);
const currentMenu = useSelector(activeMenu);
const currentPage = useSelector(getCurrentPageNumberByKey(currentMenu));

const previousModeRef = useRef(currentMode);

const config = pageConfigs[currentMenu];


useEffect(() => {

    handleRedirectWhenModeCleared({
        previousMode: previousModeRef.current,
        currentMode,
        dictionaryPages,
        currentMenu,
        currentPage,
        config,
        navigate,
    });


    previousModeRef.current = currentMode;


}, [
    currentMode,
    currentMenu,
    currentPage,
    dictionaryPages,
    config,
    navigate,
]);









  
  const showAddUsersToggle =
    (isSections && activeDep)  || isDepartments;

  const handleSave = async () => {
    if (!unsavedOrder) return;
    debugger
    try {
      await changeOrderOfDisplayElements(
        unsavedOrder.payload,
        unsavedOrder.menu,
        unsavedOrder.depId,
        unsavedOrder.currentMode
      );

      dispatch(clearUnsavedOrder());

      dispatch(
        setDataIsLoadedActionCreator(
          false,
          unsavedOrder.menu
        )
      );
    } catch (error) {
      console.error("Save failed:", error);
      alert(
        "❌ Не вдалося зберегти зміни. Спробуйте ще раз."
      );
    }
  };


const openMode = (mode) => {
    dispatch(setPhonesViewMode(mode));

    const page =
        dictionaryPages?.[mode]?.lastVisitedPage ?? 1;

    navigate(`/dictionary/${mode}/${page}`);
};


return (
  <BottomTableControlsView

    showAddUsersToggle={showAddUsersToggle}

    isAddUsers={isAddUsers}

    isSections={isSections}
    isDepartments={isDepartments}
    isPosition={isPosition}
    isUserTypes={isUserTypes}

    selectedPhoneType={selectedPhoneType}

    unsavedOrder={unsavedOrder}

    onToggleAddUsers={() =>
      dispatch(toggleaddUsersMode())
    }

    onOpenMode={openMode}

    onSave={handleSave}

  />
);
}

export default BottomTableControls;