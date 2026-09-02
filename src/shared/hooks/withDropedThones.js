import React from "react";
import { useDragContext } from "../../redux/contexts/useConetxt";
import { DropZone } from "../components/table/TableWrapper/subComponents/DropZone/DropZone";

export const withDropZones = (Component) => {
  const Wrapped = (props) => {
    const { editMode, pageData, page } = props;
    const { dragIds } = useDragContext();
    const { handleDrop, isOnFoundResultsPage } = props.tableDrag;

    const showDropZones =
      dragIds?.length &&
      editMode &&
      pageData?.length > 0 &&
      !isOnFoundResultsPage;

    return (
      <Component
        {...props}
        showDropZones={showDropZones}
        onTopDrop={() => handleDrop(-1, page)}
        onBottomDrop={() => handleDrop(pageData.length, page)}
      />
    );
  };

  return Wrapped;
};