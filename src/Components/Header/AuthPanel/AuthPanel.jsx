import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import s from "./AuthPanel.module.css";
import { authUserName, isUserAuthed } from "../../../redux/selectors/selector";


const AuthPanel = () => {
    const navigate = useNavigate();

    const userName = useSelector(authUserName);
    const isAuth = useSelector(isUserAuthed);

    const handleLoginClick = () => {
        navigate("/login");
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
            <span className={s.userName}>
                Привіт, {userName}
            </span>

            <button className={s.logout}>
                Вийти
            </button>
        </div>
    );
};

export default AuthPanel;