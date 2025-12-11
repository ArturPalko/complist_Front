// src/components/commonFunctions.js
export const redirectToPage = ({
  navigate,
  activeMenu,
  GovUaCurrentPage = 1,
  lotusCurrentPage = 1,
  phonesCurrentPage = 1
}) => {
  let page = 1;

  switch (activeMenu) {
    case "Gov-ua":
      page = GovUaCurrentPage || 1;
      navigate(`/mails/Gov-ua/${page}`);
      break;
    case "Lotus":
      page = lotusCurrentPage || 1;
      navigate(`/mails/Lotus/${page}`);
      break;
    case "phones":
      page = phonesCurrentPage || 1;
      navigate(`/phones/${page}`);
      break;
    default:
      navigate(`/`);
  }
};
