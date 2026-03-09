import { connect } from "react-redux";
import s from "./AuthPanel.module.css";
import { authUserName, isUserAuthed } from "../../../redux/selectors/selector";
import { logoutUser } from "../../../dal/api";
import { openLogin, closeLogin } from "../../../redux/reducers/ui-reducer";

const AuthPanel = ({ userName, isAuth, openLogin, closeLogin, logoutUser }) => {
    const handleLoginClick = () => {
        openLogin();
    };

    const handleLogoutClick = () => {
        logoutUser();
        closeLogin();
    };

    if (!isAuth) {
        return (
            <button className={s.button} onClick={handleLoginClick}>
                Вхід
            </button>
        );
    }

    return (
        <div className={s.userBlock}>
            <span className={s.userName}>Привіт, {userName}</span>
            <button className={s.logout} onClick={handleLogoutClick}>
                Вийти
            </button>
        </div>
    );
};

const mapStateToProps = (state) => ({
    userName: authUserName(state),
    isAuth: isUserAuthed(state),
});

const mapDispatchToProps = {
    openLogin,
    closeLogin,
    logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthPanel);