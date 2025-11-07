import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Preloader from "../../Components/Preloader/Preloader";
import { foundSearchValueOfPhonesPage , getPhonesPageIndexDataOfFoundResults,
   getPhonesCurrentPageNumber, isPreviousPageWasFoundResult, foundSearchValueOfLotusMailsPage,
    foundSearchValueOfGovUaPage, getLotusMails, getLotusMailsCurretPageNumber,
     getLotusMailsPageIndexDataOfFoundResults, getGovUaMails,
      getGovUaMailsPageIndexDataOfFoundResults,getGovMailsCurretPageNumber } from "../selectors/selector";
import { createContext } from "react";


export const DataLoaderContext = createContext(null);

const withDataLoader = (
  isDataLoadedselector,
  isDataFetchingselector,
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

    
    return showPreloader ? <Preloader count={count} /> : <DataLoaderContext.Provider 
                                                          value={{ 
                                                            data: props.data, 
                                                            isPreviousPageWasFoundResult: props.isPreviousPageWasFoundResult 
                                                          }}
                                                        >
                                                             <WrappedComponent />
                                                        </DataLoaderContext.Provider>

                                                        };

  const mapStateToProps = (state) => ({
    isDataLoaded: isDataLoadedselector(state),
    isDataFetching: isDataFetchingselector(state, type),
    data: dataSelector(state),
    isPreviousPageWasFoundResult:isPreviousPageWasFoundResult(state)
  });

  const mapDispatchToProps = { fetchAction}

  return connect(mapStateToProps, mapDispatchToProps)(HOC);
};

export default withDataLoader;