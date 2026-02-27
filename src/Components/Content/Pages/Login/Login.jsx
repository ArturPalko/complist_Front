import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import LoginForm from './LoginForm';

const Login = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (data) => {
        console.log('Вхід:', data);
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
        />
    );
};

export default Login;