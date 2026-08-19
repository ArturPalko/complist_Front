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
        (phone) => String(phone.id) === String(value)
      ),
    [phones, value]
  );

  const handleSelect = (phoneId) => {
    onChange(phoneId);
    setQuery("");
    setOpened(false);
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    setQuery(inputValue);
    setOpened(true);

    if (!inputValue) {
      onChange("");
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
              handleSelect("");
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
                handleSelect(phone.id);
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