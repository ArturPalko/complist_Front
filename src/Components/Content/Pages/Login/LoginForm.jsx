import s from './Login.module.css';
import lockImg from './../../../../assets/Img/lock.png'
import eyeImg from '../../../../assets/Img/eye.png'

const LoginForm = ({
    register,
    handleSubmit,
    watch,
    errors,
    showPassword,
    onTogglePassword,
    formMessage,
    onSubmit
}) => {
    const loginValue = watch('LoginName', '');
    const passwordValue = watch('Password', '');

    return (
            <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={s.title}>Вхід</h2>

     <div className={`${s.inputGroup} ${errors.LoginName ? s.error : ''}`}>
    <input {...register('LoginName', { required: true })} />
    <label className={loginValue ? s.filled : ''}>Логін</label>
</div>

<div className={`${s.inputGroup} ${errors.Password ? s.error : ''}`}>
    <input
        type={showPassword ? 'text' : 'password'}
        {...register('Password', { required: true })}
    />
    <label className={passwordValue ? s.filled : ''}>Пароль</label>
            <label className={passwordValue ? s.filled : ''}>Пароль</label>
            <button
                type="button"
                className={s.togglePassword}
                onClick={onTogglePassword}
            >
                    {showPassword 
            ? <img src={eyeImg} alt="Сховати пароль" className={s.icon} /> 
            : <img src={lockImg} alt="Сховати пароль" className={s.icon} /> }
            </button>
        </div>

        {formMessage && <div className={s.formError}>{formMessage}</div>}

        <button type="submit" className={s.submitButton}>Вхід</button>
        </form>
    );
};

export default LoginForm;