import { useMemo, useState } from "react";

export default function AddMail({onClose}) {
  const users = [
    { id: 1, name: "Іван Петренко" },
    { id: 2, name: "Олександр Шевченко" },
    { id: 3, name: "Василь Іванов" },
  ];

  const departments = [
    { id: 1, name: "IT" },
    { id: 2, name: "Бухгалтерія" },
    { id: 3, name: "Відділ кадрів" },
  ];

  const sections = [
    { id: 1, name: "Frontend" },
    { id: 2, name: "Backend" },
    { id: 3, name: "DevOps" },
  ];

  const [mail, setMail] = useState("");

  const [ownerType, setOwnerType] = useState("department");
  const [ownerId, setOwnerId] = useState("");

  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <>
      <style>{`
        .overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.35);
          display:flex;
          justify-content:center;
          align-items:center;
          font-family:Arial,Helvetica,sans-serif;
        }

        .modal{
          width:430px;
          background:#fff;
          border-radius:8px;
          padding:20px;
          box-shadow:0 8px 25px rgba(0,0,0,.2);
        }

        h2{
          margin:0 0 20px;
        }

        .field{
          margin-bottom:18px;
          position:relative;
        }

        .field label{
          display:block;
          margin-bottom:6px;
          font-weight:600;
        }

        .field input,
        .field select{
          width:100%;
          padding:10px;
          box-sizing:border-box;
          border:1px solid #ccc;
          border-radius:6px;
          font-size:14px;
        }

        .dropdown{
          position:absolute;
          top:72px;
          left:0;
          right:0;
          background:#fff;
          border:1px solid #ccc;
          border-radius:6px;
          max-height:220px;
          overflow-y:auto;
          z-index:100;
          box-shadow:0 4px 12px rgba(0,0,0,.15);
        }

        .option{
          padding:10px;
          cursor:pointer;
        }

        .option:hover{
          background:#f2f2f2;
        }

        .empty{
          padding:10px;
          text-align:center;
          color:#888;
        }

        .buttons{
          display:flex;
          justify-content:flex-end;
          gap:10px;
          margin-top:20px;
        }

        .buttons button{
          padding:8px 18px;
          border:none;
          border-radius:6px;
          cursor:pointer;
        }

        .buttons button:last-child{
          background:#4d90fe;
          color:#fff;
        }

        .buttons button:first-child{
          background:#ddd;
        }
      `}</style>

      <div className="overlay">
        <div className="modal">

          <h2>Додати Lotus-пошту</h2>

          <div className="field">
            <label>Назва поштової скриньки</label>

            <input
              value={mail}
              onChange={(e) => setMail(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Тип власника</label>

            <select
              value={ownerType}
              onChange={(e) => {
                setOwnerType(e.target.value);
                setOwnerId("");
                setQuery("");
                setOpened(false);
              }}
            >
              <option value="department">Департамент</option>
              <option value="section">Секція</option>
              <option value="user">Користувач</option>
            </select>
          </div>

          {ownerType === "department" && (
            <div className="field">
              <label>Департамент</label>

              <select
                value={ownerId}
                onChange={(e) => setOwnerId(Number(e.target.value))}
              >
                <option value="">Оберіть</option>

                {departments.map((d) => (
                  <option
                    key={d.id}
                    value={d.id}
                  >
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {ownerType === "section" && (
            <div className="field">
              <label>Секція</label>

              <select
                value={ownerId}
                onChange={(e) => setOwnerId(Number(e.target.value))}
              >
                <option value="">Оберіть</option>

                {sections.map((s) => (
                  <option
                    key={s.id}
                    value={s.id}
                  >
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {ownerType === "user" && (
            <div className="field">
              <label>Користувач</label>

              <input
                value={
                  users.find((u) => u.id === ownerId)?.name ?? query
                }
                placeholder="Почніть вводити ПІБ..."
                onFocus={() => setOpened(true)}
                onChange={(e) => {
                  setOwnerId("");
                  setQuery(e.target.value);
                  setOpened(true);
                }}
              />

              {opened && (
                <div className="dropdown">

                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="option"
                      onClick={() => {
                        setOwnerId(user.id);
                        setQuery("");
                        setOpened(false);
                      }}
                    >
                      {user.name}
                    </div>
                  ))}

                  {!filteredUsers.length && (
                    <div className="empty">
                      Нічого не знайдено
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          <div className="buttons">

            <button>Скасувати</button>

            <button
              onClick={onClose?.()}
            >
              Зберегти
            </button>

          </div>

        </div>
      </div>
    </>
  );
}