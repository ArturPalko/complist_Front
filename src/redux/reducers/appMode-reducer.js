const TOGGLE_EDIT_MODE_ELEMENT = "TOGGLE_EDIT_MODE_ELEMENT";

const initialState = {
  editMode: false
};

export const appModeReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_EDIT_MODE_ELEMENT:
      return {
        ...state,
        editMode:
          action.value !== undefined
            ? action.value
            : !state.editMode
      };

    default:
      return state;
  }
};

export const toggleEditMode = (value) => ({
  type: TOGGLE_EDIT_MODE_ELEMENT,
  value
});