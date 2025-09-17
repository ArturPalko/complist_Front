import React from 'react';
import s from './PagesNavBar.module.css';
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";

class PagesNavBar extends React.Component {
  render() {
    const { countOfPages } = this.props;

    return (
      <div className={s.navigationOfPage}>
        {Array.from({ length: countOfPages }, (_, i) => {
          const pageNumber = i + 1;
          return (
            <NavLink
              key={i}
              to={`/phones/${pageNumber}`}
              className={({ isActive }) =>
                `${s.pageNavigator} ${isActive ? s.activeLink : ""}`
              }
            >
              {pageNumber}
            </NavLink>
          );
        })}
      </div>

    );
  }
}
const mapStateToProps = (state) => ({
  countOfPages:state.phones.phones.length
});
const mapDispatchToProps = {  };

export default connect(mapStateToProps, mapDispatchToProps)(PagesNavBar);

