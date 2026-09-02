import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import s from "./OneFieldFormForBaseEntities.module.css";
import { fetchDictionariesThunk } from "../../../dal/api";
import { useDispatch } from "react-redux";

export default function OneFieldFormForBaseEntities({
  onClose,
  onSubmit,
  editValue,
  title,
}) {
  const dispatch = useDispatch();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  // Підстановка значення для edit
  useEffect(() => {
    reset({
      name: editValue || "",
    });

    setServerError("");
  }, [editValue, reset]);

  const submitHandler = async (data) => {
    setServerError("");

    try {
      await onSubmit({
        name: data.name.trim(),
      });

      reset({
        name: "",
      });

      onClose?.();

    } catch (err) {
      console.error(
        "EntityModal error:",
        err
      );

      const message =
        err?.response?.data?.message ||
        "Не вдалося зберегти запис.";

      setServerError(message);

    } finally {
      dispatch(
        fetchDictionariesThunk()
      );
    }
  };

  return (
    <div className={s.overlay}>
      <div className={s.modal}>

        <h2 className={s.title}>
          {title}
        </h2>

        <form
          onSubmit={handleSubmit(
            submitHandler
          )}
        >
          <label className={s.label}>
            Назва
          </label>

          <input
            className={s.input}
            type="text"
            placeholder="Введіть значення"
            autoFocus
            {...register("name", {
              required:
                "Поле обовʼязкове",

              minLength: {
                value: 2,
                message:
                  "Мінімум 2 символи",
              },
            })}
          />

          {/* Помилка валідації форми */}
          {errors.name && (
            <p className={s.error}>
              {errors.name.message}
            </p>
          )}

          {/* Помилка від backend */}
          {serverError && (
            <p className={s.error}>
              {serverError}
            </p>
          )}

          <div className={s.actions}>
            <button
              type="button"
              className={s.cancelButton}
              onClick={onClose}
            >
              Скасувати
            </button>

            <button
              type="submit"
              className={s.okButton}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "..."
                : "Зберегти"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

