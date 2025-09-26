import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Preloader from "../../Components/Preloader/Preloader";
import { toggleSearchFieldActionCreator } from "../toggledElements-reducer";
import { toggleChecboxActionCreator } from "../topTable-reducer";


const withDataLoader = (
  isDataLoadedselector,
  isDataFetchingselector,
 // isCheckboxShowSearchField,
  dataSelector,
  fetchAction,
  type,
  fetchUrl,
  actionCreator
) => (WrappedComponent) => {
  const HOC = (props) => {
    const navigate = useNavigate();
    const [count, setCount] = useState(10);
    const [showPreloader, setShowPreloader] = useState(false);

    useEffect(() => {
      if (!showPreloader) return;

      const timerId = setInterval(() => {
        setCount((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            setShowPreloader(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerId);
    }, [showPreloader]);

    useEffect(() => {
      if (props.isDataLoaded) return;

      setShowPreloader(true);
      setCount(10);
      console.log("Викона запит за:",type)

      const doFetch = async () => {
        try {
          await props.fetchAction(type);
        } catch (error) {
          navigate("/error", { state: { message: error.message } });

        }
        finally{
          setShowPreloader(false);
        }
      };

      doFetch();

  
    }, [props.isDataLoaded, props.fetchAction, fetchUrl, actionCreator, type]);

    return showPreloader ? <Preloader count={count} /> : <WrappedComponent {...props} />;
  };

  const mapStateToProps = (state) => ({
    isDataLoaded: isDataLoadedselector(state),
    isDataFetching: isDataFetchingselector(state, type),
    data: dataSelector(state),
   // isCheckboxShowSearchField: isCheckboxShowSearchField(state)
  });

  const mapDispatchToProps = { 
    fetchAction,
     handleToggleSearchField:toggleSearchFieldActionCreator,
     rememberCkeckboxState: toggleChecboxActionCreator}

  return connect(mapStateToProps, mapDispatchToProps)(HOC);
};

export default withDataLoader;
