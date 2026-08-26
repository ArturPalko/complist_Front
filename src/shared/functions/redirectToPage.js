import { pageConfigs } from "../../configs/app/pageConfig";
import { Pages } from "../../configs/app/constants";

export const redirectToPage = ({
  navigate,
  activeMenu,
  viewMode,
  currentPage = 1
}) => {
  if (!activeMenu && !viewMode) {
    return;
  }

  const config = viewMode
    ? pageConfigs[Pages.DICTIONARIES]
    : pageConfigs[activeMenu];

  if (!config) {
    return;
  }

  const path = viewMode
    ? `${config.basePath}${viewMode}/${currentPage}`
    : `${config.basePath}${currentPage}`;

  navigate(path);
};