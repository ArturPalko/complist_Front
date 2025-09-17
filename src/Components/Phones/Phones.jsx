import { connect } from "react-redux";
import { addPhonesActionCreator } from "../../redux/phones-reducer";
import PhonesTable from "../PhonesTable/PhonesTable";
import { compose } from "redux";
import { useParams } from "react-router-dom";
import {React, useEffect } from "react";


const PhonesPage = ({ phonesData, addPhonesActionCreator }) => {
  const params = useParams();
  const pageNumber = Number(params.pageNumber) || 1;
    useEffect(() => {
    console.log("Поточна сторінка змінилася:", pageNumber);
  }, [pageNumber]);

  return(
          <PhonesTable
              fetchUrl="http://localhost:5114/phones"
              addPhonesActionCreator={addPhonesActionCreator}
              phonesData={phonesData}
              columns={[
                { key: "userPosition", label: "Назва посади" },
                { key: "userName", label: "Прізвище, ім'я по батькові" },
                {
                  key: "phones",
                  label: "Телефон",
                  subLabels: [
                    { key: "landline", label: "Міський" },
                    { key: "extension", label: "Внутрішній" },
                    { key: "cisco", label: "IP (Cisco)" },
                  ],
                },
              ]}
              pageNumber={pageNumber}
              title="Телефонний довідник"
            />
          );

}
  
  
const mapStateToProps = (state) => ({
  phonesData: state.phones.phones,
});

const mapDispatchToProps = { addPhonesActionCreator };



export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(PhonesPage);

