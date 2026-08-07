import { useSelector } from "react-redux";
import { DataLoaderContext } from "../../../../redux/contexts/useConetxt";
import { getDictionaryData } from "../../../../redux/selectors/selector";
import { createPageBase } from "../../../../shared/components/page/GenericPage/pageFactory";
import { Pages } from "../../../../configs/app/constants";

const DictionaryPage = createPageBase(Pages.DICTIONARIES);

const Dictionaries = () => {
  const data = useSelector(getDictionaryData);
debugger
console.log ("dataInDicitonary:", data)
  return (
    <DataLoaderContext.Provider
      value={{
        data,
        isPreviousPageWasFoundResult: false,
      }}
    >
      <DictionaryPage />
    </DataLoaderContext.Provider>
  );
};

export default Dictionaries;