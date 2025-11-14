import { connect } from "react-redux";
import { getCountOfPresentedElement, activeMenu } from "../../../redux/selectors/selector";
import s from "./StatusBar.module.css";
import contacts from "../../../assets/contacts.png";
import aca from "../../../assets/aca.png";
import ConvertForLotusSVG from "../../../assets/Spinner/SVG/ConverForLotusSVG";
import ConverForGovUaSVG from "../../../assets/Spinner/SVG/ConverForGovUaSVG";
import PhonesSVG from "../../../assets/Spinner/SVG/PhonesSVG";

const StatusBar = ({ counts, activeMenu }) => {
  return (
    <div >
      {activeMenu === "phones" && <PhonesSVG counts={counts} />}
      {activeMenu === "lotus" && <ConvertForLotusSVG counts={counts} aca={aca} />}
      {activeMenu === "gov-ua" && <ConverForGovUaSVG counts={counts} />}
    </div>
  );
};

const mapStateToProps = (state) => ({
  counts: getCountOfPresentedElement(state, activeMenu(state).toLowerCase()),
  activeMenu: activeMenu(state).toLowerCase(),
});

export default connect(mapStateToProps)(StatusBar);
