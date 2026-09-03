
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useRedirectOnDictionaryReload = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const navigation =
      performance.getEntriesByType("navigation")[0];

    const isReload = navigation?.type === "reload";

    const isDictionaryRoute =
      window.location.pathname.startsWith("/dictionary/");

    if (isReload && isDictionaryRoute) {
      navigate("/mails/Gov-ua/1", {
        replace: true,
      });
    }
  }, []);
};

