import { useState, useEffect} from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Preloader from "../../Components/UI/Preloader/Preloader";
import { 
   getDataForMenu, 
   getLoadedForMenu,
   getFetchingForMenu, 
   isPreviousPageWasFoundResult } from  "../selectors/selector";
import { DataLoaderContext } from "../contexts/useConetxt";


const withDataLoaderForMenu = (menuName, fetchAction) => (WrappedComponent) => {
  const HOC = (props) => {
    const navigate = useNavigate();
    const [count, setCount] = useState(10);
    const [showPreloader, setShowPreloader] = useState(false);

    const data = props.data;

    
    const isLoaded = props.isLoaded;

    // Таймер Preloader
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

    // Fetch даних
    useEffect(() => {
      if (isLoaded) return;

      setShowPreloader(true);
      setCount(10);

      const doFetch = async () => {
        try {
          await props.fetchAction(menuName);
        } catch (error) {
          navigate("/error", { state: { message: error.message } });
        } finally {
          setShowPreloader(false);
        }
      };

      doFetch();
    }, [isLoaded, props.fetchAction, menuName, navigate]);

console.log("GovUa data:", data)
    return showPreloader ? (
      <Preloader count={count} />
    ) : (
      <DataLoaderContext.Provider value={{ data  ,
        isPreviousPageWasFoundResult:props.isPreviousPageWasFoundResult
      } }>
        <WrappedComponent {...props} />
      </DataLoaderContext.Provider>
    );
  };

  const mapStateToProps = (state) => ({
    data: getDataForMenu(state, menuName),
    isLoaded: getLoadedForMenu(state, menuName),
    isFetching: getFetchingForMenu(state, menuName),
    isPreviousPageWasFoundResult: isPreviousPageWasFoundResult(menuName)(state)
 

  });

  return connect(mapStateToProps, { fetchAction })(HOC);
};

export default withDataLoaderForMenu;
