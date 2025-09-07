import React from 'react';
import s from './Content.module.css';
import { connect } from 'react-redux';
import { addGovUaMailsActionCreator } from '../../redux/gov-ua-reduser';

class Content extends React.Component {

  async componentDidMount() {
    try {
      const response = await fetch("http://localhost:5114/dovidniki");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.props.addGovUaMailsActionCreator(data);
      console.log(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  render() {   
    let rowNumber = 1;
    return (

      <div className={s.content}>
        <h2>Поштові скриньки Вінницької митниці <u>customs.gov.ua</u></h2>
        <table>
          <thead>
            <tr>
              <th>№ п/п </th>
              <th>найменування скриньки</th>
              <th>найменування підрозділу</th>
              <th>відповідальна особа</th>
            </tr>
          </thead>
          <tbody>
            {this.props.govuamailsPage.govuamails.map((m) => (
              <tr key={rowNumber}>
                <td>{rowNumber++}</td>
                <td>{m.mailName}</td>
                <td>{m.departmentOrSection}</td>
                <td>{m.userName}</td>
        
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  govuamailsPage: state.govuamailsPage
});

const mapDispatchToProps = {
  addGovUaMailsActionCreator
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
