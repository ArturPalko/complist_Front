import { useEffect } from "react";
import { useForm } from "react-hook-form";
import s from "./AddPosition.module.css";
import { addPosition } from "../../../dal/api";
import { fetchDictionariesThunk } from "../../../dal/api";
import { useDispatch } from "react-redux";

export default function AddPositionModal({ onClose, onSubmit, editValue , mode, modalData}) {
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
 const dispatch = useDispatch();
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
  try {
    let value;
debugger
    switch (mode) {
      case "edit":
        value = {
          id: modalData.id,
          name: data.name,
          priority: modalData.priority,
        };
        break;
      case "add":
        value = data.name.trim();
      break
      case "delete":
        debugger
        value = modalData;

      // default:
      //   value = data.name.trim();
      //   break;
    }
    debugger

    // 🔥 ВАЖЛИВО: чекаємо submit
    await onSubmit?.(value);
debugger
    reset({ name: "" });
    onClose?.();

  } catch (err) {
    console.error("Add position error:", err);
  } finally {
    dispatch(fetchDictionariesThunk());
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