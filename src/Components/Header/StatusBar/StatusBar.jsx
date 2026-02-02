import React from "react";
import { connect } from "react-redux";
import { activeMenu as getActiveMenu ,getCountsForActiveMenu } from "../../../redux/selectors/selector.js"
import { pageConfigs } from "../../../configs/pageConfig.js";

const StatusBar = ({ counts, activeMenu }) => {

  const Diagram = pageConfigs[activeMenu]?.StatusDiagram;

  if (!Diagram) return null; 

  return <Diagram counts={counts} />;
};

const mapStateToProps = (state) => ({
  counts: getCountsForActiveMenu(state),
  activeMenu: getActiveMenu(state),
});

export default connect(mapStateToProps)(StatusBar);
