import React from 'react';
import s from './GovUaMails.module.css';
import { connect } from 'react-redux';
import { addGovUaMailsActionCreator } from '../../redux/gov-ua-reduser';

class Phones extends React.Component {

  async componentDidMount() {
    try {
      const response = await fetch("http://localhost:5114/mails/lotus");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.props.addLotusMailsActionCreator(data);
      console.log(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  render() {   
    let rowNumber = 1;
    return (

      <div className={s.content}>
        <h2>Поштові скриньки Вінницької митниці <u>Lotus</u></h2>
        <table>
          <thead>
            <tr>
              <th>№ п/п </th>
              <th>Стара назва скриньки</th>
              <th>Нова назва скриньки</th>
              <th>Назва підрозділу</th>
            </tr>
          </thead>
          <tbody>
            {this.props.lotusmailsPage.lotusmails.map((m) => (
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
  govuamailsPage: state.lotusmailsPage
});

const mapDispatchToProps = {
  addLotusMailsActionCreator
};

export default connect(mapStateToProps, mapDispatchToProps)(LotusMails);