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
  activeMenu,
  isUserMode
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
import { setLastVisitedPage } from "../../../redux/reducers/pagesNavbar-reducer";

const BottomTableControls = () => {
  const dispatch = useDispatch();

  const isSections = useSelector(isSectionsMode);
  const activeDep = useSelector(selectAtiveDepartmentId);
  const isDepartments = useSelector(isDepartmentsMode);
  const isPosition = useSelector(isPositionsMode);
  const isUserTypes = useSelector(isUserTypesMode);
  const mode = useSelector(getCurrentMode);
  const isAddUsers = useSelector(addUsersModeSelected);
  const isUsers = useSelector(isUserMode);
  const navigate = useNavigate()
  const phoneTypes = ["landline", "internal", "cisco"];
  const description = (isDepartments && !activeDep)
  ? `• Порядок департаментів визначає порядок їх відображення в меню «Телефони».
• Світліші рядки — департаменти, які не представлені в цьому меню та не впливають на позначки розриву.
• Для перерахунку позначок розриву після зміни порядку перейдіть на сторінку «Телефони».`
  : "";
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
        unsavedOrder.currentMode
          ? "phones"
          : unsavedOrder.menu
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

    let page =
        dictionaryPages?.[mode]?.lastVisitedPage ?? 1;

    if (page === "foundResults") {
        page =
            dictionaryPages?.[mode]?.digitPage ?? 1;

        dispatch(
            setLastVisitedPage(
                "dictionary",
                page,
                mode
            )
        );
    }

    navigate(`/dictionary/${mode}/${page}`);
};


return (
  <BottomTableControlsView
    description={description}
    
    showAddUsersToggle={showAddUsersToggle}

    isAddUsers={isAddUsers}

    isSections={isSections}
    isDepartments={isDepartments}
    isPosition={isPosition}
    isUserTypes={isUserTypes}
    isUsers={isUsers}

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