import { connect } from "react-redux";
import s from "./AuthPanel.module.css";
import { authUserName, isUserAuthed } from "../../../redux/selectors/selector";
import { logoutUser } from "../../../dal/thunks/authThunks";
import { useLoginModal } from "../../../redux/hooks/useLoginModal";

const AuthPanel = ({ userName, isAuth, logoutUser }) => {
  const { openModal, closeModal } = useLoginModal();

  const handleLoginClick = () => openModal();

  const handleLogoutClick = () => {
    logoutUser();
    closeModal(); 
  };

  if (!isAuth) {
    return <button className={s.button} onClick={handleLoginClick}>Вхід</button>;
  }

  return (
    <div className={s.userBlock}>
      <span className={s.userName}>Привіт, {userName}</span>
      <button className={s.logout} onClick={handleLogoutClick}>Вийти</button>
    </div>
  );
};

const mapStateToProps = (state) => ({
    userName: authUserName(state),
    isAuth: isUserAuthed(state),
});

const mapDispatchToProps = {
    logoutUser
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthPanel);