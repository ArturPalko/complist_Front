import { pageConfigs } from "../../configs/app/pageConfig";


export const redirectToPage = ({ navigate, activeMenu, currentPage = 1 }) => {
  if (!activeMenu) {
    return;
  }

  const config = pageConfigs[activeMenu];


  const path = `${config.basePath}${currentPage}`;
  debugger;
  navigate(path);
};

