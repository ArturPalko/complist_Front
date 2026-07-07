import { useMemo, useState } from "react";
import s from "./AddUser.module.css"

const departments = [
  { id: 1, name: "IT" },
  { id: 2, name: "Бухгалтерія" },
  { id: 3, name: "Адміністрація" }
];

const sections = [
  { id: 1, departmentId: 1, name: "Frontend" },
  { id: 2, departmentId: 1, name: "Backend" },
  { id: 3, departmentId: 1, name: "DevOps" },
  { id: 4, departmentId: 2, name: "Зарплата" },
  { id: 5, departmentId: 2, name: "Податки" },
  { id: 6, departmentId: 3, name: "Канцелярія" }
];

const positions = [
  { id: 1, name: "Програміст" },
  { id: 2, name: "Керівник" },
  { id: 3, name: "Бухгалтер" }
];

const userTypes = [
  { id: 1, name: "Працівник" },
  { id: 2, name: "Керівник" }
];

 
 
export default function AddUser() {
  const [fullName, setFullName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [userTypeId, setUserTypeId] = useState("");

  const availableSections = useMemo(() => {
    return sections.filter(
      (s) => String(s.departmentId) === String(departmentId)
    );
  }, [departmentId]);

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <h2>Додати користувача</h2>

        <div style={s.field}>
          <label style={s.label}>ПІБ</label>
          <input
            style={s.input}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Посада</label>
          <select
            style={s.input}
            value={positionId}
            onChange={(e) => setPositionId(e.target.value)}
          >
            <option value="">Оберіть</option>
            {positions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div style={s.row}>
          <div style={s.field}>
            <label style={s.label}>Департамент</label>
            <select
              style={s.input}
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setSectionId("");
              }}
            >
              <option value="">Оберіть</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div style={s.field}>
            <label style={s.label}>Секція</label>
            <select
              style={s.input}
              value={sectionId}
              disabled={!departmentId}
              onChange={(e) => setSectionId(e.target.value)}
            >
              <option value="">Без секції</option>
              {availableSections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={s.field}>
          <label style={s.label}>Тип користувача</label>
          <select
            style={s.input}
            value={userTypeId}
            onChange={(e) => setUserTypeId(e.target.value)}
          >
            <option value="">Оберіть</option>
            {userTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div style={s.buttons}>
          <button
            style={s.cancel}
            onClick={() => {
              setFullName("");
              setDepartmentId("");
              setSectionId("");
              setPositionId("");
              setUserTypeId("");
            }}
          >
            Скасувати
          </button>

          <button
            style={s.save}
            onClick={() =>
              console.log({
                fullName,
                departmentId,
                sectionId,
                positionId,
                userTypeId
              })
            }
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
}