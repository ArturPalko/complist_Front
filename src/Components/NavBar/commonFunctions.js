import { pageConfigs } from "../../configs/pageConfig"


export const redirectToPage = ({
  navigate,
  activeMenu,
  currentPage = 1
}) => {
  const config = pageConfigs[activeMenu];


  const path = `${config.basePath}${currentPage}`;
  navigate(path);
};
