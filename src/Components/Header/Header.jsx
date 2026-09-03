import React from 'react';
import { useNavigate } from 'react-router-dom';



import s from './Header.module.css';
import Search from './Search/Search';
import StatusBar from './StatusBar/StatusBar.jsx';
import AuthPanel from './AuthPanel/AuthPanel.jsx';
import { useHelpModalAction } from '../../redux/hooks/useHelpModalAction.js';


// Передає navigate в класовий компонент
function withNavigation(Component) {
    return function(props) {
        const navigate = useNavigate();

        return (
            <Component
                {...props}
                navigate={navigate}
            />
        );
    };
}


// Передає дію відкриття Help-модалки
function withHelpModal(Component) {
    return function(props) {
        const { openHelpModal } = useHelpModalAction();

        return (
            <Component
                {...props}
                openHelpModal={openHelpModal}
            />
        );
    };
}


class Header extends React.Component {
    render() {
        const { openHelpModal } = this.props;

        return (
            <div className='header'>

                <div className={s.statusBar}>
                    <StatusBar />
                </div>

                <div className={s.searchBar}>
                    <Search />
                </div>

                <button
                    className={s.helpButton}
                    onClick={openHelpModal}
                >
                    <span className={s.helpIcon}>?</span>
                    <span>Я не знаю як користуватись</span>
                </button>

                <div className={s.singIn}>
                    <AuthPanel />
                </div>

            </div>
        );
    }
}


export default withHelpModal(withNavigation(Header));
