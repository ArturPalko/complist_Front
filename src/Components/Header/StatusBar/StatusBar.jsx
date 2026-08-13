import { connect } from "react-redux";
import {
  activeMenu as getActiveMenu,
  getCountsForActiveMenu,
  getCurrentMode
} from "../../../redux/selectors/selector.js";
import { pageConfigs } from "../../../configs/app/pageConfig.js";

const StatusBar = ({ counts, activeMenu, currentMode }) => {
  const configKey = currentMode ? "dictionary" : activeMenu;
  const Diagram = pageConfigs[configKey]?.StatusDiagram;

  if (!Diagram) return null;

  return <Diagram counts={counts} />;
};

const mapStateToProps = (state) => ({
  counts: getCountsForActiveMenu(state),
  activeMenu: getActiveMenu(state),
  currentMode: getCurrentMode(state)
});

export default connect(mapStateToProps)(StatusBar);