import { activeMenu, getPhones, foundSearchValueOfPhonesPage } from "../../redux/selectors/selector";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import PhonesPage from "../Phones/Phones";



const FoundResults = (props) => {
     const [rowech, setRowsToPresent] = useState([]);
    useEffect(() => {
       console.log ("Rowech!!!!!!!:",rowech);
        const phones = props.getPhones || [];
        const foundData = props.foundSearchValueOfPhonesPage;
        
  
        
       // if (!foundData?.foundResults) return;

        // Відфільтруємо рядки, які відповідають результатам пошуку
const rowsToPresent = phones.flatMap(phonesData =>
    phonesData.rows.filter(row =>
        foundData.foundResults.some(resultsData =>
            resultsData &&
            phonesData.pageIndex === resultsData.currentPage &&
            (
                // пошук по верхньому рівню властивостей row
                Object.values(row).includes(resultsData.dataValue) ||
                // пошук по row.phones тільки по властивості phoneName
                (row.phones && row.phones.some(phoneObj => 
                    phoneObj.phoneName === resultsData.dataValue
                    
                ))

            )
        )
    )
);



        setRowsToPresent(rowsToPresent);
        console.log("Активне меню", props.activeMenu);
        console.log("Телефони", phones);
        console.log("Знайдені результати:", foundData);
        console.log("Відобразимо на сторінці:", rowsToPresent);

    }, [props.activeMenu, props.getPhones, props.foundSearchValueOfPhonesPage]);

    useEffect(() => {
        console.log("Оновлений rowech:", rowech);
    }, [rowech]);

    return (
     <PhonesPage rowech={rowech}/>)
};

const mapStateToProps = (state) => ({
    activeMenu: activeMenu(state),
    getPhones: getPhones(state),
    foundSearchValueOfPhonesPage: foundSearchValueOfPhonesPage(state)
});

export default connect(mapStateToProps)(FoundResults);
