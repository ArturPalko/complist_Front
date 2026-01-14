import { connect } from "react-redux";
import { getCountsForActiveMenu } from "../../../redux/selectors/selector"; // новий селектор
import { activeMenu as getActiveMenu } from "../../../redux/selectors/selector"; // твій активний menu селектор
import s from "./StatusBar.module.css";
import aca from "../../../assets/aca.png";
import ConvertForLotusSVG from "../../../assets/Spinner/SVG/ConverForLotusSVG";
import ConverForGovUaSVG from "../../../assets/Spinner/SVG/ConverForGovUaSVG";
import PhonesSVG from "../../../assets/Spinner/SVG/PhonesSVG";

const StatusBar = ({ counts, activeMenu }) => {
  return (
    <div>
      {activeMenu === "phones" && <PhonesSVG counts={counts} />}
      {activeMenu === "Lotus" && <ConvertForLotusSVG counts={counts} aca={aca} />}
      {activeMenu === "Gov-ua" && <ConverForGovUaSVG counts={counts} />}
    </div>
  );
};

const mapStateToProps = (state) => ({
  counts: getCountsForActiveMenu(state),
  activeMenu: getActiveMenu(state)
});

export default connect(mapStateToProps)(StatusBar);
