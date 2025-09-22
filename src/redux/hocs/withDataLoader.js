import React from "react";
import { connect } from "react-redux";
import { getLotusMails,isLotusDataLoaded, isGovUaDataLoaded } from "../selectors/selector";

const withDataLoader = (isDataLoadedselector,isDataFetchingselector, dataSelector, fetchAction, type) => (WrappedComponent) => {
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
  }
}, [props.isDataLoaded, props.fetchAction,  type]);


    return <WrappedComponent {...props} />;
  };

  const mapStateToProps = (state) => ({
    isDataLoaded: isDataLoadedselector(state),
    isDataFetching: isDataFetchingselector(state,type),
     data: dataSelector(state),
  });

  const mapDispatchToProps = {
    fetchAction: fetchAction
  };

  return connect(mapStateToProps, mapDispatchToProps)(HOC);
};

export default withDataLoader;
