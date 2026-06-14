import { connect } from "react-redux";
import s from "./AuthPanel.module.css";
import { authUserName, isUserAuthed } from "../../../redux/selectors/selector";
import { logoutUser } from "../../../dal/thunks/authThunks";
import { useModal } from "../../../redux/hooks/useLoginModal";

const AuthPanel = ({ userName, isAuth, logoutUser }) => {
  const { openModal } = useModal();

  const handleLoginClick = () => {
    openModal("login");
  };

  const handleLogoutClick = () => {
    logoutUser();
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
  logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthPanel);