export const handleRedirectWhenModeCleared = ({
    previousMode,
    currentMode,
    dictionaryPages,
    currentMenu,
    currentPage,
    config,
    navigate,
}) => {

    if (!previousMode || currentMode) {
        return;
    }


    const page =
        dictionaryPages?.[currentMenu]?.lastVisitedPage ??
        currentPage ??
        1;


    const basePath = config?.basePath ?? "/";


    navigate(`${basePath}${page}`);
};