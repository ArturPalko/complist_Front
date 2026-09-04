import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";

import { getBottomTableDescription } from "./getBottomTableDesctiption";

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
  isUserMode,
  isCurrentPageFoundResult,
  getSearchMode,
  hasSearchFoundResults
} from "../../../redux/selectors/selector";

import {
  clearUnsavedOrder,
  toggleaddUsersMode,
  setDictionaryViewMode,
} from "../../../redux/reducers/ui-reducer";

import { changeOrderOfDisplayElements } from "../../../dal/api";
import { setDataIsLoadedActionCreator } from "../../../redux/reducers/app-reducer";

import { pageConfigs } from "../../../configs/app/pageConfig";
import { handleRedirectWhenModeCleared } from "./helpers";
import BottomTableControlsView from "./BottomTableControlsView";

import { setLastVisitedPage } from "../../../redux/reducers/pagesNavbar-reducer";
import { PHONE_TYPES } from "../../../configs/app/constants";

const BottomTableControls = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =====================================================
  // MENU / MODE
  // =====================================================

  const currentMenu = useSelector(activeMenu);
  const currentMode = useSelector(getCurrentMode);
  const searchMode = useSelector(getSearchMode)
  // =====================================================
  // MODES
  // =====================================================

  const isSections = useSelector(isSectionsMode);
  const activeDep = useSelector(selectAtiveDepartmentId);
  const isDepartments = useSelector(isDepartmentsMode);
  const isPosition = useSelector(isPositionsMode);
  const isUserTypes = useSelector(isUserTypesMode);
  const isUsers = useSelector(isUserMode);
  const isAddUsers = useSelector(addUsersModeSelected);

  // =====================================================
  // DICTIONARY
  // =====================================================

  const dictionaryPages = useSelector(
    getDictionaryPages
  );

  const currentPage = useSelector(
    getCurrentPageNumberByKey(currentMenu)
  );

  // =====================================================
  // PHONE TYPE
  // =====================================================

  const selectedPhoneType = PHONE_TYPES.includes(
    currentMode
  )
    ? currentMode
    : "";

  // =====================================================
  // UNSAVED ORDER
  // =====================================================

  const unsavedOrder = useSelector(
    (state) => state.ui.unsavedOrder
  );

  // =====================================================
  // FOUND RESULTS
  // =====================================================

  const isFoundResultsPage = useSelector(
    isCurrentPageFoundResult(currentMenu,currentMode)
  );
const hasSearchResults = useSelector(
  hasSearchFoundResults(
    currentMenu,
    currentMode
  )
);
  // =====================================================
  // REDIRECT LOGIC
  // =====================================================

  const previousModeRef = useRef(
    currentMode
  );

  const config =
    pageConfigs[currentMenu];

  // =====================================================
  // DESCRIPTION
  // =====================================================
debugger
  const description =
    getBottomTableDescription({
      currentMenu,
      currentMode,
      activeDep,
      isFoundResultsPage,
      searchMode,
      hasSearchResults 
    });

  // =====================================================
  // EFFECT
  // =====================================================

  useEffect(() => {
    handleRedirectWhenModeCleared({
      previousMode:
        previousModeRef.current,

      currentMode,

      dictionaryPages,

      currentMenu,

      currentPage,

      config,

      navigate,
    });

    previousModeRef.current =
      currentMode;
  }, [
    currentMode,
    currentMenu,
    currentPage,
    dictionaryPages,
    config,
    navigate,
  ]);

  // =====================================================
  // ADD USERS TOGGLE
  // =====================================================

  const showAddUsersToggle =
    (isSections && activeDep) ||
    isDepartments;

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {
    if (!unsavedOrder) {
      return;
    }

    try {
      await changeOrderOfDisplayElements(
        unsavedOrder.payload,
        unsavedOrder.menu,
        unsavedOrder.depId,
        unsavedOrder.currentMode
      );

      dispatch(
        clearUnsavedOrder()
      );

      dispatch(
        setDataIsLoadedActionCreator(
          false,
          unsavedOrder.currentMode
            ? "phones"
            : unsavedOrder.menu
        )
      );
    } catch (error) {
      console.error(
        "Save failed:",
        error
      );

      alert(
        "❌ Не вдалося зберегти зміни. Спробуйте ще раз."
      );
    }
  };

  // =====================================================
  // OPEN MODE
  // =====================================================

  const openMode = (mode) => {
    dispatch(
      setDictionaryViewMode(mode)
    );

    let page =
      dictionaryPages?.[mode]
        ?.lastVisitedPage ?? 1;

    if (page === "foundResults") {
      page =
        dictionaryPages?.[mode]
          ?.digitPage ?? 1;

      dispatch(
        setLastVisitedPage(
          "dictionary",
          page,
          mode
        )
      );
    }

    navigate(
      `/dictionary/${mode}/${page}`
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <BottomTableControlsView
      description={description}
      showAddUsersToggle={
        showAddUsersToggle
      }
      isAddUsers={isAddUsers}
      isSections={isSections}
      isDepartments={isDepartments}
      isPosition={isPosition}
      isUserTypes={isUserTypes}
      isUsers={isUsers}
      selectedPhoneType={
        selectedPhoneType
      }
      unsavedOrder={unsavedOrder}
      onToggleAddUsers={() =>
        dispatch(
          toggleaddUsersMode()
        )
      }
      onOpenMode={openMode}
      onSave={handleSave}
    />
  );
};

export default BottomTableControls;