import { useEffect } from "react";
import { useForm } from "react-hook-form";
import s from "./AddPosition.module.css";
import { addPosition } from "../../../dal/api";

export default function AddPositionModal({ onClose, onSubmit, editValue }) {
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

  // 🔥 Ось головне — підставляємо editValue в форму
  useEffect(() => {
    if (editValue) {
      reset({
        name: editValue,
      });
    } else {
      reset({
        name: "",
      });
    }
  }, [editValue, reset]);

  const onSubmitForm = async (data) => {
    const value = data.name.trim();

    if (!value) return;

    try {
      const res = await addPosition(value);

      console.log("Created:", res.data);

      onSubmit?.(value);
      reset({ name: "" }); // очистка після submit
      onClose?.();
    } catch (err) {
      console.error("Add position error:", err);
    }
  };

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <h2 className={s.title}>Додати посаду</h2>

        <form onSubmit={handleSubmit(onSubmitForm)}>
          <label className={s.label}>Назва посади</label>

          <input
            className={s.input}
            type="text"
            placeholder="Введіть назву посади"
            autoFocus
            {...register("name", {
              required: "Назва обовʼязкова",
              minLength: {
                value: 2,
                message: "Мінімум 2 символи",
              },
            })}
          />

          {errors.name && (
            <p style={{ color: "red" }}>{errors.name.message}</p>
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
              {isSubmitting ? "..." : "ОК"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}