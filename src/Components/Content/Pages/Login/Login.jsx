import { useState } from "react";
import { useForm } from "react-hook-form";
import LoginForm from "./LoginForm";
import { loginUser } from "../../../../dal/api";
import { useDispatch, useSelector } from "react-redux";
import { formMessage } from "../../../../redux/selectors/selector";

const Login = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    mode: "onSubmit",
    shouldFocusError: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const message = useSelector(formMessage); 

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <LoginForm
      register={register}
      handleSubmit={handleSubmit}
      watch={watch}
      errors={errors}
      showPassword={showPassword}
      onTogglePassword={() => setShowPassword(prev => !prev)}
      onSubmit={onSubmit}
      formMessage={message} // беремо з useSelector
    />
  );
};

export default Login;