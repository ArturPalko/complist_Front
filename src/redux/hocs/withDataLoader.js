import React from "react";
import { connect } from "react-redux";
import { getLotusMails,isLotusDataLoaded, isGovUaDataLoaded } from "../selectors/selector";

const withDataLoader = (isDataLoadedselector, dataSelector, fetchAction, setLoadedAction, type) => (WrappedComponent) => {
  const HOC = (props) => {
   React.useEffect(() => {
  if (!props.isDataLoaded) {
    if (type == "phones"){
      props.fetchAction();
    }
    else{
      props.fetchAction(type);
    }
    console.log(`Виконано запит за ${type}`);
    props.setLoadedAction(true, type);
  }
}, [props.isDataLoaded, props.fetchAction, props.setLoadedAction, type]);


    return <WrappedComponent {...props} />;
  };

  const mapStateToProps = (state) => ({
    isDataLoaded: isDataLoadedselector(state),
     data: dataSelector(state),
  });

  const mapDispatchToProps = {
    fetchAction: fetchAction,
    setLoadedAction: setLoadedAction,
  };

  return connect(mapStateToProps, mapDispatchToProps)(HOC);
};

export default withDataLoader;
