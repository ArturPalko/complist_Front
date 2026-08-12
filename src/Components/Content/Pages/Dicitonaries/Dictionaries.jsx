import { useSelector } from "react-redux";
import { useContext } from "react";

import {
  getDictionaryData,
  isPreviousPageWasFoundResult,
} from "../../../../redux/selectors/selector";

import {
  FoundResultsContext,
  DataLoaderContext,
} from "../../../../redux/contexts/useConetxt";

import { createPageBase } from "../../../../shared/components/page/GenericPage/pageFactory";
import { Pages } from "../../../../configs/app/constants";

const DictionaryPage = createPageBase(Pages.DICTIONARIES);

const Dictionaries = () => {
  const data = useSelector(getDictionaryData);

  const foundResultsContext = useContext(FoundResultsContext);

  const previousPageWasFoundResult = useSelector(
    isPreviousPageWasFoundResult("dictionary")
  );

  const finalData = foundResultsContext?.foundResults
    ? [
        {
          pageIndex: 1,
          rows: foundResultsContext.foundResults,
          type: foundResultsContext.currentMode,
        },
      ]
    : data;



  return (
    <DataLoaderContext.Provider
      value={{
        data: finalData,
        isPreviousPageWasFoundResult: previousPageWasFoundResult,
      }}
    >
      <DictionaryPage />
    </DataLoaderContext.Provider>
  );
};

export default Dictionaries;