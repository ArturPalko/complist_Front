import { activeMenu, getPhones, foundSearchValueOfPhonesPage, getPhonesPageIndexDataOfFoundResults } from "../../redux/selectors/selector";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import PhonesPage from "../Phones/Phones";



const FoundResults = (props) => {
     const [rowsToPresent, setRowsToPresent] = useState([]);
     const [indexDataOfFoundResultsForFoundResultsPage, setindexDataOfFoundResultsForFoundResultsPage] = useState([]);
     const keysToKeep = ["currentPage", "index"];

     function prepareRowToPresentandSearchedIndexes(){
        const phones = props.getPhones || [];
        const foundData = props.foundSearchValueOfPhonesPage; 
        let foundResults= props.foundSearchValueOfPhonesPage.foundResults;
       setindexDataOfFoundResultsForFoundResultsPage(props.getPhonesPageIndexDataOfFoundResults);
       //debugger;
        setRowsToPresent(phones.flatMap(phonesData =>
        phonesData.rows.filter(row =>
            foundData.foundResults.some(resultsData =>
                resultsData &&
                phonesData.pageIndex === resultsData.currentPage &&
                (
                    Object.values(row).includes(resultsData.dataValue) ||
                    (row.phones && row.phones.some(phoneObj => 
                        phoneObj.phoneName === resultsData.dataValue
                        
                    ))
                )
            )
        ))
    );
     }
    useEffect(() => {
        prepareRowToPresentandSearchedIndexes();
        
    }, [props.activeMenu, props.getPhones, props.foundSearchValueOfPhonesPage]);

    useEffect(() => {
        console.log("Відобразимо на сторінці:", rowsToPresent);
       console.log("Відобразимо на сторінці indexDataOfFoundResultsForFoundResultsPage:", indexDataOfFoundResultsForFoundResultsPage);
    }, [rowsToPresent]);

    return (
     <PhonesPage foundResults={rowsToPresent} indexDataOfFoundResultsForFoundResultsPage={indexDataOfFoundResultsForFoundResultsPage} isRenderFromFoundResultsPage={false}  />)
};

const mapStateToProps = (state) => ({
    activeMenu: activeMenu(state),
    getPhones: getPhones(state),
    foundSearchValueOfPhonesPage: foundSearchValueOfPhonesPage(state),
    getPhonesPageIndexDataOfFoundResults:getPhonesPageIndexDataOfFoundResults(state)


});

export default connect(mapStateToProps)(FoundResults);
