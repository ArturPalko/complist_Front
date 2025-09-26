import React from 'react';
import s from './Header.module.css'
import Search from './Search/Search';

class Header extends React.Component{
    render(){
        return (
            <div className='header'>
                <div className={s.searchBar}>
                    <Search/>
                </div>
                <div className= {s.singIn}>
                    <button className={s.button}>Вхід</button>
                </div>
            </div>
            )
    }
}

export default Header