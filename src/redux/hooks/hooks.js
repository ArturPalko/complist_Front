import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { rememberPreviousLocationActionCreator } from "../pagesNavbar-reducer";

export const usePageNumber = () => {
  const params = useParams();
  return Number(params.pageNumber) || 1;
};


export const useTrackLocation = () => {
  const location = useLocation();
  const prevPathRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (prevPathRef.current && prevPathRef.current !== location.pathname) {
      dispatch(rememberPreviousLocationActionCreator(prevPathRef.current));
    }
    prevPathRef.current = location.pathname;
  }, [location, dispatch]);
};
