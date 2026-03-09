import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import LoginForm from "./LoginForm/LoginForm";
import { loginUser } from "../../../../dal/api";
import { closeLogin } from "../../../../redux/reducers/ui-reducer";
import { formMessage } from "../../../../redux/selectors/selector";
import { setupModalBehavior } from "./helpers";
import s from "./Login.module.css";

const Login = ({ message, user, loginUser, closeLogin }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    mode: "onSubmit",
    shouldFocusError: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const cleanup = setupModalBehavior(closeLogin);
    return cleanup; // викликається при розмонтуванні
  }, [closeLogin]);

  const onSubmit = async (data) => {
     loginUser(data);
  };

  const handleOverlayClick = () => {
    closeLogin();
  };

  return (
    <div className={s.loginOverlay} onClick={handleOverlayClick}>
      <div className={s.loginModal} onClick={(e) => e.stopPropagation()}>
        <LoginForm
          register={register}
          handleSubmit={handleSubmit}
          watch={watch}
          errors={errors}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(prev => !prev)}
          onSubmit={onSubmit}
          formMessage={message}
        />
        <button
          className={s.closeButton}
          onClick={closeLogin}
        >
          Закрити
        </button>
      </div>
    </div>
  );
};


const mapStateToProps = (state) => ({
  message: formMessage(state),
  user: state.auth.user,
});


const mapDispatchToProps = {
  loginUser,
  closeLogin
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);