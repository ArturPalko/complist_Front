// Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import s from './Header.module.css';
import Search from './Search/Search';
import StatusBar from './StatusBar/StatusBar.jsx';

// Обгортка для передачі navigate в класовий компонент
function withNavigation(Component) {
    return function(props) {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    }
}

class Header extends React.Component {
    handleLoginClick = () => {
        this.props.navigate('/login');
    }

    render() {
        return (
            <div className='header'>
                <div className={s.statusBar}>
                    <StatusBar />
                </div>
                <div className={s.searchBar}>
                    <Search />
                </div>
                <div className={s.singIn}>
                    <button 
                        className={s.button} 
                        onClick={this.handleLoginClick}
                    >
                        Вхід
                    </button>
                </div>
            </div>
        );
    }
}

export default withNavigation(Header);