import { activeMenu } from "../../redux/selectors/selector"
import { connect } from "react-redux";
import { useEffect } from "react";
import PhonesPage from '../Phones/Phones';
import LotusMails from "../LotusMails/LotusMails";
import GovUaMails from "../GovUaMails/GovUaMails";
import { getPhones } from "../../redux/selectors/selector";
import { foundSearchValueOfPhonesPage } from "../../redux/selectors/selector";



const FoundResults = (props) => {
    useEffect(() => {
   console.log ("Активне меню", props.activeMenu);
   console.log ("Телефони", props.getPhones);
   console.log(props.foundSearchValueOfPhonesPage);
   
  }, [props.activeMenu]);

return ("Тестуємо");
  
};



const mapStateToProps = (state) => ({
  activeMenu:activeMenu(state),
  getPhones:  getPhones(state),
  foundSearchValueOfPhonesPage:foundSearchValueOfPhonesPage(state)
  
});

const mapDispatchToProps = {  };

export default connect(mapStateToProps, mapDispatchToProps)(FoundResults);

