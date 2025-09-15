import React from 'react';
import s from './Header.module.css'

class Header extends React.Component{
    render(){
        return (
            <div className='header'>
                <div className= {s.singIn}>
                    <button className={s.button}>Вхід</button>
                </div>
            </div>
            )
    }
}

export default Header