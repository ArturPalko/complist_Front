export const parseLocation = (pathname) => {
  const parts = pathname.split("/").filter(Boolean);
  let pageName = "", basePath = "", pageFromURL = "1";

  if (parts[0] === "phones") {
    pageName = "phones"; basePath = "/phones/"; pageFromURL = parts[1];
  } else if (parts[0] === "mails") {
    if (parts[1] === "Lotus") { pageName = "Lotus"; basePath = "/mails/Lotus/"; pageFromURL = parts[2]; }
    else if (parts[1] === "Gov-ua") { pageName = "Gov-ua"; basePath = "/mails/Gov-ua/"; pageFromURL = parts[2]; }
  }

  return { pageName, basePath, pageFromURL };
};
