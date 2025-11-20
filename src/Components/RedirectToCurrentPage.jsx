import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RedirectToCurrentPage = ({ selector, buildPath }) => {
  const page = useSelector(selector);

  if (!page) return null;
  
  return <Navigate to={buildPath(page)} replace />;
};

export default RedirectToCurrentPage;
