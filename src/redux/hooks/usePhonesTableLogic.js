import { useSelector } from "react-redux";
import { useTableBaseLogic } from "../../shared/hooks/useTableBaseLogic";
import {
  getDepartmentsAndSectionsPerPage,
  selectDashedBlocks,
  selectFoundResults,
  isEditModeSelected,
  selectIndexesFromCell
} from "../selectors/selector";
import { getDimGroupRowClasses } from "../../Components/Content/Tables/PhonesTable/phonesTableHelpers";
import s from "../../Components/Content/Tables/PhonesTable/PhonesTable.module.css";


export const usePhonesTableLogic = (props) => {
  
  const tableLogic = useTableBaseLogic({ ...props });

  const index = useSelector(state => selectIndexesFromCell(state));
  let data = tableLogic.pageData;
  

   let currentData = data[index-1];
  //  let indexValue = currentData.departmentId || currentData.setionId || currentData.id
 let indexValue = currentData?.sectionId  ||currentData?.departmentId  || currentData?.id
 debugger
  if(indexValue){
console.log("indexVALUE:",  indexValue)
debugger
  }  
   console.log ("index:",index)
   console.log ("data:", data)
   console.log("indexVALUE:", indexValue)
  


  const indexDecrementFromPreviousPages = useSelector(getDepartmentsAndSectionsPerPage)
    .slice(0, props.pageNumber - 1)
    .reduce((acc, val) => acc + val, 0);

  const dashedBlocks = useSelector(selectDashedBlocks);

  // 🔥 NEW: stopDismiss deps
  const foundResults = useSelector((state) =>
    selectFoundResults(state, "phones")
  );

  const isEditMode = useSelector(isEditModeSelected);

  const foundResultsInclude = (id) =>
    foundResults?.some((item) => item.id === id);

  const stopDismiss = (id) =>{
//     if(data.length <15){
//       debugger
// return
//     } 
    if(index.length>0 ){
      // debugger
   return  foundResultsInclude(indexValue) && isEditMode && indexValue ==id;
    }
    else{
    return  foundResultsInclude(id) && isEditMode;
    }
    

  }
    

  // 🔥 IMPORTANT: helper per row
  const getRowDimClasses = (id) => {
  //     console.log("ID:", id);
  // console.log("stopDismiss:", stopDismiss(id));
    // debugger
    if (stopDismiss(id)) 
     {
      // debugger
      return { hidden: true }
    }
    
// debugger
    return getDimGroupRowClasses({
      hasFoundResults:
        props.indexesOfFoundResultsForCurrentPage?.length > 0,
      showPreviousPageHighlight: tableLogic.showPreviousPageHighlight,
      isPagesNavbarLinkElementOnCurrentPagePressed:
        tableLogic.isPagesNavbarLinkElementOnCurrentPagePressed,
      styles: s,
    });
  };

  return {
    ...tableLogic,
    indexDecrementFromPreviousPages,
    dashedBlocks,
    getRowDimClasses, // 👈 замість dimClasses
  };
};