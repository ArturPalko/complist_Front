import React from 'react';
import s from './NavBar.module.css';
import { NavLink } from 'react-router-dom';


class NavBar extends React.Component{
    render(){
        return (
              <div className="nav">
                    <nav>
                        <div className={s.item}>
                        <NavLink to="/mails/Gov-ua" className={({ isActive }) => (isActive ? s.activeLink : undefined)}>GOV-UA скриньки</NavLink>
                        </div>
                        <div className={s.item}>
                            <NavLink to="/mails/Lotus" className={({ isActive }) => (isActive ? s.activeLink : undefined)}>Lotus скриньки</NavLink>
                        </div>
                        <div className={s.item}>
                            <NavLink to="/Phones" className={({ isActive }) => (isActive ? s.activeLink : undefined)}>Телфони</NavLink>
                        </div>
                        
                    </nav>
                </div>
        )
    }
}

export default NavBar