import React from 'react';
import s from './NavBar.module.css';
import { NavLink } from 'react-router-dom';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropdown: true, 
    };
  }

  toggleDropdown = () => {
    this.setState((prev) => ({ showDropdown: !prev.showDropdown }));
  };

  render() {
    return (
      <div className="nav">
        <nav>
          <div className={s.item}>
            <button onClick={this.toggleDropdown} className={s.dropdownBtn}>
              Довідники {this.state.showDropdown ? "▲" : "▼"}
            </button>
            {this.state.showDropdown && (
              <div className={s.dropdownContent}>
                <NavLink
                  to="/mails/Gov-ua"
                  className={({ isActive }) => (isActive ? s.activeLink : undefined)}
                >
                  GOV-UA скриньки
                </NavLink>
                <NavLink
                  to="/mails/Lotus"
                  className={({ isActive }) => (isActive ? s.activeLink : undefined)}
                >
                  Lotus скриньки
                </NavLink>
                <NavLink
                  to="/phones"
                  className={({ isActive }) => (isActive ? s.activeLink : undefined)}
                >
                  Телефони
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>
    );
  }
}

export default NavBar;
