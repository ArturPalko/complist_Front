import React from "react";
import { useDragContext } from "../../redux/contexts/useConetxt";
import { currentPageByMenu } from "../../redux/selectors/selector";
import { useSelector } from "react-redux";
import { activeMenu } from "../../redux/selectors/selector";
import { DropZone } from "../components/table/TableWrapper/subComponents/DropZone/DropZone";

export const withDropZones = (Component) => {
  const Wrapped = (props) => {
    const { editMode, pageData,page } = props;
    const { handleDrop } = props.tableDrag;
    const showDropZones =  editMode && pageData?.length > 0

    
    return (
      <>

      {/* BOTTOM */}
      <DropZone onDrop={(e) => handleDrop(-1, page)} className="edgeDropTopRow" showDropZones={showDropZones} />

        {/* MAIN TABLE BODY (rows) */}
        <Component {...props} />

       
      {/* BOTTOM */}
      <DropZone onDrop={(e) => handleDrop(pageData.length, page)} className="edgeDropBottomRow" showDropZones={showDropZones} />
      </>
    );
  };

  return Wrapped;
};