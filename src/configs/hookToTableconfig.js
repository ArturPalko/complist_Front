import { usePhonesTableLogic } from "../redux/hooks/usePhonesTableLogic.js";
import { useMailsTableLogic } from "./pageConfig.js";
import PhonesTable from "../Components/PhonesTable/PhonesTable.jsx";
import MailsTable from "../Components/MalisTable/MailsTable.jsx";

export const hookToTableConfig = {
  [PhonesTable.name]: {
    hook: usePhonesTableLogic,
    props: ["columns", "pageNumber", "rowsPerPage", "indexesOfFoundResultsForCurrentPage", "departmentsAndSectionsPerPage", "foundResults", "indexDataOfFoundResultsForFoundResultsPage", "headerRef", "titleRef"]
  },
  [MailsTable.name]: {
    hook: useMailsTableLogic,
    props: ["mailType", "pageNumber", "rowsPerPage", "foundResults", "indexesOfFoundResultsForCurrentPage", "indexDataOfFoundResultsForFoundResultsPage", "titleRef", "headerRef"]
  }
};

