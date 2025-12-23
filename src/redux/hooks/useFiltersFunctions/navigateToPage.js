export  const navigateToPage = (page) => {
    let basePath;
    switch (activeMenu) {
      case "Gov-ua": basePath = "/mails/Gov-ua/"; break;
      case "Lotus": basePath = "/mails/Lotus/"; break;
      case "phones": basePath = "/phones/"; break;
      default: basePath = "/"; break;
    }
    navigate(basePath + page);
  };
