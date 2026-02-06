// src/components/commonFunctions.js
export const redirectToPage = ({
  navigate,
  activeMenu,
  currentPage = 1
}) => {
  debugger;
  switch (activeMenu) {
    case "Gov-ua":
    case "Lotus":
      navigate(`/mails/${activeMenu}/${currentPage}`);
      break;

    case "phones":
      navigate(`/phones/${currentPage}`);
      break;

    default:
      navigate(`/`);
  }
};
