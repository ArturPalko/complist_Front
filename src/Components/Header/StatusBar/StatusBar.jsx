import { connect } from "react-redux";
import { activeMenu as getActiveMenu ,getCountsForActiveMenu } from "../../../redux/selectors/selector.js"
import { pageConfigs } from "../../../configs/app/pageConfig.js";

const StatusBar = ({ counts, activeMenu }) => {

  const Diagram = pageConfigs[activeMenu]?.StatusDiagram;

  if (!Diagram) return null; 

  return   <div style={{ userSelect: "none" }}>
      <Diagram counts={counts} />
    </div>
};

const mapStateToProps = (state) => ({
  counts: getCountsForActiveMenu(state),
  activeMenu: getActiveMenu(state),
});

export default connect(mapStateToProps)(StatusBar);
