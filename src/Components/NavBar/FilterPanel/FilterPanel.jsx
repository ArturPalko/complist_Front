import { connect } from "react-redux";
import {
  getGovUaMails,
  activeMenu,
  getFilteredState,
  getLotusMails
} from "../../../redux/selectors/selector";
import s from "../FilterPanel/FilterPanel.module.css";
import CustomCheckbox from "./CustomCheckbox/CustomCheckBox.jsx";
import { useEffect, useState } from "react";
import { addFilter, clearCurrentForm } from "../../../redux/selectors/filterData-reducer.js";

const FilterPanel = (props) => {
  const [filteredData, setFilteredData] = useState([]);

  const govUa = "gov-ua";
  const lotus = "lotus";
  const filterPoints = [
    { pages: [govUa,lotus],groupName:"Власник", key: "personalMails", label: "Персональні" },
    { pages: [govUa,lotus], groupName:"Власник", key: "departmentMails", label: "Самостійного підрозділу" },
    { pages: [govUa,lotus], groupName:"Власник", key: "sectionMails", label: "(Не) самостійного підрозділу" },

    { pages: [govUa], groupName:"Позитивна властивість", key: "hasResponsible", label: "Має відповідальну особу" },
    { pages: [lotus], groupName:"Позитивна властивість", key: "hasNewPostName", label: "Має нову назву" },
    { pages: [lotus], groupName:"Позитивна властивість", key: "hasPrevioustName", label: "Має стару назву" },
    { pages: [govUa,lotus], groupName:"Позитивна властивість", key: "passwordKnown", label: "Пароль відомий" },

    { pages: [govUa], groupName:"Негативна властивість", key: "hasNoResponsible", label: "(Не) має відповідальну особу" },
     { pages: [lotus], groupName:"Негативна властивість", key: "NOThasNewPostName", label: "(Не) має нову назву" },
     { pages: [lotus], groupName:"Позитивна властивість", key: "NOThasPrevioustName", label: "(Не) має стару назву" },
    {pages: [govUa,lotus], groupName:"Негативна властивість", key: "passwordUnKnown", label: "Пароль не відомий" }
  ];

  const filterGroups = {
    personalMails: ["departmentMails", "sectionMails"],
    hasResponsible: ["hasNoResponsible"],
    passwordKnown: ["passwordUnKnown"],
    hasNewPostName:["NOThasNewPostName"],
    hasPrevioustName:["NOThasPrevioustName"]
  };
  
  const filterPointsForCurrentMenu = filterPoints.filter((point)=> point.pages.includes(props.activeMenu.toLowerCase()));
  const groupedFilterPoints = filterPointsForCurrentMenu.reduce((acc, item) => {
    if (!acc[item.groupName]) acc[item.groupName] = [];
    acc[item.groupName].push(item);
    return acc;
  }, {});

  const conditions = {
    personalMails: (el) => el.ownerType === "User",
    departmentMails: (el) => el.ownerType === "Department",
    sectionMails: (el) => el.ownerType === "Section",
    hasResponsible: (el) => el.responsibleUser !== "",
    passwordKnown: (el) => el.passwordKnown === true,
    hasPrevioustName: (el) => el.previousName !="",
    hasNoResponsible: (el) => el.responsibleUser === "",
    hasNewPostName: (el) => el.name !=null,
    passwordUnKnown: (el) => el.passwordKnown === false,
    NOThasNewPostName:(el)=> el.name == null,
    NOThasPrevioustName:(el)=> el.previousName ==""
  };

  const [checkboxState, setCheckboxState] = useState({});

  const getAlternativeKeys = (key) => {
    const direct = filterGroups[key] || [];
    const reverse = Object.keys(filterGroups).filter((k) =>
      filterGroups[k].includes(key)
    );
    return [...direct, ...reverse];
  };

  useEffect(() => {
    const used = props.getFilteredState(props.activeMenu);

    const initialState = {};
    filterPoints.filter((point)=> point.pages.includes(props.activeMenu.toLowerCase())).forEach((item) => {
      initialState[item.key] = used[item.key] || false;
    });
    setCheckboxState(initialState);

    const filters = Object.entries(used)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);

    let dataFromStore = [];
    let filteredData = [];

    const comboGroups = Object.values(filterGroups);

switch (props.activeMenu.toLowerCase()) {
  case "gov-ua":
    dataFromStore = props.getGovUaMails;
    break;
  case "lotus":
    dataFromStore = props.getLotusMails;
    break;
  default:
    dataFromStore = [];
}

dataFromStore.forEach((element) => {
  element.rows.forEach((row) => {

    const comboPass = comboGroups.every((group) => {
      const activeInGroup = group.filter((key) => filters.includes(key));
      if (activeInGroup.length === 0) return true;
      return activeInGroup.some((key) => conditions[key](row));
    });

    const normalPass = filters
      .filter((filter) => !comboGroups.flat().includes(filter))
      .every((filter) => conditions[filter](row));

    if (comboPass && normalPass) filteredData.push(row);
  });
});

setFilteredData(filteredData);
console.log(filteredData);

  }, [props.activeMenu, props.getFilteredState]);

  const handleCheckboxChange = (key) => {
    const altKeys = getAlternativeKeys(key);

    setCheckboxState((prev) => {
      const updated = { ...prev };
      const newValue = !prev[key];
      updated[key] = newValue;

      if (newValue === true) {
        altKeys.forEach((alt) => (updated[alt] = false));
      }

      return updated;
    });

    props.addFilter(props.activeMenu, key);
  };

  function handleOnClearFormButtonClick(){
    props.clearCurrentForm(props.activeMenu);
  }

  return (
    <div className={s.panel}>
      <div className={s.panelContent}>
        <div className={s.menu}>
        <h4>Кількісьть:{filteredData.length}</h4>
        <button onClick={handleOnClearFormButtonClick}>Скинути</button>
        </div>
        

        {Object.entries(groupedFilterPoints).map(([groupName, items]) => (
          <fieldset key={groupName}>
            <legend>{groupName}</legend>

            {items.map((item) => {
              const altKeys = getAlternativeKeys(item.key);
              const isDisabled = altKeys.some((alt) => checkboxState[alt]);

              return (
                <CustomCheckbox
                  key={item.key}
                  label={item.label}
                  checked={checkboxState[item.key] || false}
                  onChange={() => handleCheckboxChange(item.key)}
                  bgColor="white"
                  checkColor="black"
                  disabled={isDisabled}
                />
              );
            })}
          </fieldset>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  activeMenu: activeMenu(state),
  getGovUaMails: getGovUaMails(state),
  getLotusMails: getLotusMails(state),
  getFilteredState: (menu) => getFilteredState(state, menu)
});

const mapDispatchToProps = { addFilter, clearCurrentForm };

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
