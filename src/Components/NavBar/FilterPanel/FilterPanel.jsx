import { connect } from "react-redux";
import {
getGovUaMails,
activeMenu,
getFilteredState,
getLotusMails
} from "../../../redux/selectors/selector";
import s from "../FilterPanel/FilterPanel.module.css";
import CustomCheckbox from "./CustomCheckbox/CustomCheckBox.jsx";
import { useState } from "react";
import { addFilter, clearCurrentForm, addIndexesOfFiltredResults } from "../../../redux/selectors/filterData-reducer.js";

const CHUNK_SIZE = 18;

const FilterPanel = (props) => {
const govUa = "gov-ua";
const lotus = "lotus";

const filterPoints = [
{ pages: [govUa, lotus], groupName: "Власник", key: "personalMails", label: "Персональні" },
{ pages: [govUa, lotus], groupName: "Власник", key: "departmentMails", label: "Самостійного підрозділу" },
{ pages: [govUa, lotus], groupName: "Власник", key: "sectionMails", label: "(Не) самостійного підрозділу" },
{ pages: [govUa], groupName: "Позитивна властивість", key: "hasResponsible", label: "Має відповідальну особу" },
{ pages: [lotus], groupName: "Позитивна властивість", key: "hasNewPostName", label: "Має нову назву" },
{ pages: [lotus], groupName: "Позитивна властивість", key: "hasPrevioustName", label: "Має стару назву" },
{ pages: [govUa, lotus], groupName: "Позитивна властивість", key: "passwordKnown", label: "Пароль відомий" },
{ pages: [govUa], groupName: "Негативна властивість", key: "hasNoResponsible", label: "(Не) має відповідальну особу" },
{ pages: [lotus], groupName: "Негативна властивість", key: "NOThasNewPostName", label: "(Не) має нову назву" },
{ pages: [lotus], groupName: "Позитивна властивість", key: "NOThasPrevioustName", label: "(Не) має стару назву" },
{ pages: [govUa, lotus], groupName: "Негативна властивість", key: "passwordUnKnown", label: "Пароль не відомий" }
];

const filterGroups = {
personalMails: ["departmentMails", "sectionMails"],
hasResponsible: ["hasNoResponsible"],
passwordKnown: ["passwordUnKnown"],
hasNewPostName: ["NOThasNewPostName"],
hasPrevioustName: ["NOThasPrevioustName"]
};

const conditions = {
personalMails: (el) => el.ownerType === "User",
departmentMails: (el) => el.ownerType === "Department",
sectionMails: (el) => el.ownerType === "Section",
hasResponsible: (el) => el.responsibleUser !== "",
passwordKnown: (el) => el.passwordKnown === true,
hasPrevioustName: (el) => el.previousName !== "",
hasNoResponsible: (el) => el.responsibleUser === "",
hasNewPostName: (el) => el.name != null,
passwordUnKnown: (el) => el.passwordKnown === false,
NOThasNewPostName: (el) => el.name == null,
NOThasPrevioustName: (el) => el.previousName === ""
};

const filterPointsForCurrentMenu = filterPoints.filter((p) =>
p.pages.includes(props.activeMenu.toLowerCase())
);

const groupedFilterPoints = filterPointsForCurrentMenu.reduce((acc, item) => {
if (!acc[item.groupName]) acc[item.groupName] = [];
acc[item.groupName].push(item);
return acc;
}, {});

const [checkboxState, setCheckboxState] = useState(() => {
const used = props.getFilteredState(props.activeMenu);
const initialState = {};
filterPointsForCurrentMenu.forEach((item) => {
initialState[item.key] = used[item.key] || false;
});
return initialState;
});

const getAlternativeKeys = (key) => {
const direct = filterGroups[key] || [];
const reverse = Object.keys(filterGroups).filter((k) => filterGroups[k].includes(key));
return [...direct, ...reverse];
};

const computeFilteredChunks = (state) => {
const filters = Object.entries(state).filter(([_, v]) => v).map(([key]) => key);
let dataFromStore = props.activeMenu.toLowerCase() === "gov-ua" ? props.getGovUaMails : props.getLotusMails;
const allFilteredIndexes = [];


dataFromStore.forEach((element, pageIndex) => {
  element.rows.forEach((row, rowIndex) => {
    const comboPass = Object.values(filterGroups).every((group) => {
      const activeInGroup = group.filter((key) => filters.includes(key));
      if (!activeInGroup.length) return true;
      return activeInGroup.some((key) => conditions[key](row));
    });

    const normalPass = filters
      .filter((f) => !Object.values(filterGroups).flat().includes(f))
      .every((f) => conditions[f](row));

    if (comboPass && normalPass) allFilteredIndexes.push({ page: pageIndex+1, index: rowIndex });
  });
});

// Чанкування по 18 елементів
const chunks = [];
for (let i = 0; i < allFilteredIndexes.length; i += CHUNK_SIZE) {
  chunks.push({ pageIndex: chunks.length + 1, rows: allFilteredIndexes.slice(i, i + CHUNK_SIZE) });
}
return chunks;


};

const handleCheckboxChange = (key) => {
const altKeys = getAlternativeKeys(key);
setCheckboxState((prev) => {
const updated = { ...prev, [key]: !prev[key] };
if (updated[key]) altKeys.forEach((alt) => (updated[alt] = false));


  const chunks = computeFilteredChunks(updated);
  props.addIndexesOfFiltredResults(props.activeMenu, chunks);
  props.addFilter(props.activeMenu, key);

  return updated;
});


};

const handleOnClearFormButtonClick = () => {
props.clearCurrentForm(props.activeMenu);
setCheckboxState({});
props.addIndexesOfFiltredResults(props.activeMenu, []);
};

const filteredChunks = computeFilteredChunks(checkboxState);

return ( <div className={s.panel}> <div className={s.panelContent}> <div className={s.menu}> <h4>Кількість: {filteredChunks.reduce((sum, c) => sum + c.rows.length, 0)}</h4> <button onClick={handleOnClearFormButtonClick}>Скинути</button> </div>

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

const mapDispatchToProps = { addFilter, clearCurrentForm, addIndexesOfFiltredResults };

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
