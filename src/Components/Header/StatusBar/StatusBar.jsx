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

const mapStateToProps = (state) => {
  const allCounts = getCountOfPresentedElement(state); // весь об’єкт counts
  const menu = activeMenu(state).toLowerCase();

  // вибираємо counts для активного меню
  let countsForMenu = {};
  if (menu === "phones") countsForMenu = allCounts.phones || {};
  if (menu === "lotus") countsForMenu = allCounts.Lotus || {};
  if (menu === "gov-ua") countsForMenu = allCounts["Gov-ua"] || {};

  return {
    counts: countsForMenu,
    activeMenu: menu
  };
};

export default connect(mapStateToProps)(StatusBar);
