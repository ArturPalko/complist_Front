import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import LoginForm from "./LoginForm/LoginForm";
import { loginUser } from "../../../dal/thunks/authThunks";
import { formMessage } from "../../../redux/selectors/selector";
import { setupModalBehavior } from "./helpers";
import s from "./Login.module.css";

const Login = ({ message, loginUser, onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    shouldFocusError: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  // Налаштування поведінки модалки (клік за ESC тощо)
  useEffect(() => {
    const cleanup = setupModalBehavior(onClose);
    return cleanup; // викликається при розмонтуванні
  }, [onClose]);

  const onSubmit = async (data) => {
    loginUser(data);
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className={s.loginOverlay} onClick={handleOverlayClick}>
      <div className={s.loginModal} onClick={(e) => e.stopPropagation()}>
        <LoginForm
          register={register}
          handleSubmit={handleSubmit}
          watch={watch}
          errors={errors}
          showPassword={showPassword}
          onTogglePassword={togglePassword}
          onSubmit={onSubmit}
          formMessage={message}
        />
        <button className={s.closeButton} onClick={onClose}>
          Закрити
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  message: formMessage(state),
});

const mapDispatchToProps = {
  loginUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);