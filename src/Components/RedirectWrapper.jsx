import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { phonesCurrentPage, GovUaCurrentPage, lotusCurrentPage } from "../redux/selectors/selector";

export const PhonesRedirect = () => {
  const phonesPage = useSelector(phonesCurrentPage);

  if (!phonesPage) return null; // поки state не готовий – нічого не рендеримо
  return <Navigate to={`/phones/${phonesPage}`} replace />;
};

export const GovUaRedirect = () => {
  const govUaPage = useSelector(GovUaCurrentPage);

  if (!govUaPage) return null;
  return <Navigate to={`/mails/Gov-ua/${govUaPage}`} replace />;
};

export const LotusRedirect = () => {
  const lotusPage = useSelector(lotusCurrentPage);

  if (!lotusPage) return null;
  return <Navigate to={`/mails/Lotus/${lotusPage}`} replace />;
};
