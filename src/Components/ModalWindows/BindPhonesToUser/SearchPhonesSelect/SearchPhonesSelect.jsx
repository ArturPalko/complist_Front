import { useMemo, useState } from "react";
import s from "../../../../shared/components/forModal/SearchUsersSelect/SearchUserSelect.module.css";

export default function SearchPhoneSelect({
  phones = [],
  value,
  onChange,
  placeholder = "Оберіть телефон...",
}) {
  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState(false);

  const filteredPhones = useMemo(() => {
    const search = query.trim().toLowerCase();

    return phones.filter((phone) =>
      String(phone.number ?? "")
        .toLowerCase()
        .includes(search)
    );
  }, [phones, query]);

  const selectedPhone = useMemo(
    () =>
      phones.find(
        (phone) =>
          String(phone.number) === String(value)
      ),
    [phones, value]
  );

  const handleSelect = (phoneValue) => {
    onChange(phoneValue);
    setQuery("");
    setOpened(false);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;

    setQuery(value);
    setOpened(true);

    if (!value) {
      onChange("__none__");
    }
  };

  return (
    <div className={s.wrapper}>
      <input
        className={s.input}
        value={selectedPhone?.number ?? query}
        placeholder={placeholder}
        onFocus={() => setOpened(true)}
        onChange={handleInputChange}
      />

      {opened && (
        <div className={s.dropdown}>
          <div
            className={s.option}
            onMouseDown={(event) => {
              event.preventDefault();
              handleSelect("__none__");
            }}
          >
            Не призначено
          </div>

          {filteredPhones.map((phone) => (
            <div
              key={phone.id}
              className={s.option}
              onMouseDown={(event) => {
                event.preventDefault();
                handleSelect(phone.number);
              }}
            >
              {phone.number}
            </div>
          ))}

          {!filteredPhones.length && (
            <div className={s.empty}>
              Нічого не знайдено
            </div>
          )}
        </div>
      )}
    </div>
  );
}