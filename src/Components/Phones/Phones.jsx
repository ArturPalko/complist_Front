import React, { useEffect } from "react";
import { connect } from "react-redux";
import PhonesTable from "../PhonesTable/PhonesTable"; // правильний шлях

import { compose } from "redux";
import { getPhones,rowsPerPage } from "../../redux/selectors/selector";
import { getPhonesData } from "../../redux/phones-reducer";
import { useParams } from "react-router-dom"
import { usePageNumber } from "../../redux/hooks/hooks";

const PhonesPage = ({ phonesData, getPhonesData }) => {

  useEffect(() => {
    getPhonesData(); 
    console.log("виконано запит за телефонами")
  }, []);

  return (
    <PhonesTable
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
      pageNumber={usePageNumber()}
      title="Телефонний довідник"
      rowsPerPage={rowsPerPage}
    />
  );
};

const mapStateToProps = (state) => ({
  phonesData: getPhones(state),
  rowsPerPage:rowsPerPage
});

export default compose(
  connect(mapStateToProps, { getPhonesData })
)(PhonesPage);
