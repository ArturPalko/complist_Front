import React from 'react';
import s from './Login.module.css';

const LoginForm = ({
    register,
    handleSubmit,
    watch,
    errors,
    showPassword,
    onTogglePassword,
    onSubmit
}) => {
    // слідкуємо за значеннями полів
    const loginValue = watch('login', '');
    debugger;
    const passwordValue = watch('password', '');

    return (
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={s.title}>Вхід</h2>

            <div className={`${s.inputGroup} ${errors.login ? s.error : ''}`}>
                <input
                    type="text"
                    {...register('login', { required: true })}
                />
                <label className={loginValue ? s.filled : ''}>Логін</label>
            </div>

            <div className={`${s.inputGroup} ${errors.password ? s.error : ''}`}>
                <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: true })}
                />
                <label className={passwordValue ? s.filled : ''}>Пароль</label>
                <button
                    type="button"
                    className={s.togglePassword}
                    onClick={onTogglePassword}
                >
                    {showPassword ? 'Сховати' : 'Показати'}
                </button>
            </div>

            <button type="submit" className={s.submitButton}>Вхід</button>
        </form>
    );
};

export default LoginForm;