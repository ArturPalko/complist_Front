import React, { useEffect, useRef, useState } from "react";
import s from "../AddPhone/AddPhone.module.css";

const departments = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  name: `Департамент ${index + 1}`,
}));

const sections = departments.flatMap((department) =>
  Array.from({ length: 20 }, (_, index) => ({
    id: department.id * 100 + index + 1,
    departmentId: department.id,
    name: `Секція ${index + 1}`,
  }))
);

function CustomDropdown({
  label,
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
}) {
  const [opened, setOpened] = useState(false);
  const wrapperRef = useRef(null);

  const selectedOption = options.find(
    (option) => option.id === value
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpened(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option.id);
    setOpened(false);
  };

  return (
    <div className={s.field}>
      <label className={s.label}>
        {label}
      </label>

      <div
        className={s.dropdown}
        ref={wrapperRef}
      >
        <button
          type="button"
          className={[
            s.dropdownTrigger,
            opened ? s.dropdownTriggerOpen : "",
            disabled ? s.dropdownDisabled : "",
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={disabled}
          onClick={() =>
            setOpened((prev) => !prev)
          }
        >
          <span
            className={
              selectedOption
                ? s.selectedText
                : s.placeholder
            }
          >
            {selectedOption
              ? selectedOption.name
              : placeholder}
          </span>

          <span
            className={[
              s.arrow,
              opened ? s.arrowOpen : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            ▼
          </span>
        </button>

        {opened && (
          <div className={s.dropdownMenu}>
            <div className={s.optionsList}>
              {options.length === 0 ? (
                <div className={s.empty}>
                  Немає доступних значень
                </div>
              ) : (
                options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={[
                      s.option,
                      option.id === value
                        ? s.optionSelected
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() =>
                      handleSelect(option)
                    }
                  >
                    <span>
                      {option.name}
                    </span>

                    {option.id === value && (
                      <span className={s.check}>
                        ✓
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TransferUser() {
  const [departmentId, setDepartmentId] =
    useState(null);

  const [sectionId, setSectionId] =
    useState(null);

  const [
    keepResponsibleForMails,
    setKeepResponsibleForMails,
  ] = useState(false);

  const [
    keepPhonesByPosition,
    setKeepPhonesByPosition,
  ] = useState(false);

  const [
    transferPhones,
    setTransferPhones,
  ] = useState(false);

  const filteredSections =
    departmentId === null
      ? []
      : sections.filter(
          (section) =>
            section.departmentId ===
            departmentId
        );

  const handleDepartmentChange = (id) => {
    setDepartmentId(id);
    setSectionId(null);
  };

  const selectedDepartment =
    departments.find(
      (department) =>
        department.id === departmentId
    );

  const selectedSection =
    sections.find(
      (section) =>
        section.id === sectionId
    );

  const canTransfer =
    departmentId !== null &&
    sectionId !== null;

  const handleTransfer = () => {
    if (!canTransfer) {
      return;
    }

    const data = {
      userIds: [101, 102, 103],

      departmentId,
      sectionId,

      keepResponsibleForMails,
      keepPhonesByPosition,
      transferPhones,
    };

    console.log(
      "TRANSFER USER:",
      data
    );

    alert(
      JSON.stringify(
        data,
        null,
        2
      )
    );
  };

  return (
    <div className={s.container}>
          <div className={s.modal}>

        <h2 className={s.title}>
          Перевести користувача
        </h2>

        <CustomDropdown
          label="Департамент"
          value={departmentId}
          options={departments}
          placeholder="Оберіть департамент"
          onChange={
            handleDepartmentChange
          }
        />

        <CustomDropdown
          label="Секція"
          value={sectionId}
          options={filteredSections}
          placeholder={
            departmentId === null
              ? "Спочатку оберіть департамент"
              : "Оберіть секцію"
          }
          onChange={setSectionId}
          disabled={
            departmentId === null
          }
        />

        <div className={s.divider} />

        <div className={s.optionsGroup}>
          <div className={s.optionsTitle}>
            Додаткові параметри
          </div>

          <label className={s.checkboxRow}>
            <input
              type="checkbox"
              checked={
                keepResponsibleForMails
              }
              onChange={(e) =>
                setKeepResponsibleForMails(
                  e.target.checked
                )
              }
            />

            <span className={s.checkboxText}>
              Зберегти відповідальним за
              колишні скриньки
            </span>
          </label>

          <label className={s.checkboxRow}>
            <input
              type="checkbox"
              checked={
                keepPhonesByPosition
              }
              onChange={(e) =>
                setKeepPhonesByPosition(
                  e.target.checked
                )
              }
            />

            <span className={s.checkboxText}>
              Залишити поточні телефони
              за посадою у підрозділі
            </span>
          </label>

          <label className={s.checkboxRow}>
            <input
              type="checkbox"
              checked={transferPhones}
              onChange={(e) =>
                setTransferPhones(
                  e.target.checked
                )
              }
            />

            <span className={s.checkboxText}>
              Перенести телефони
            </span>
          </label>
        </div>

        <button
          type="button"
          className={s.button}
          disabled={!canTransfer}
          onClick={handleTransfer}
        >
          Перевести
        </button>

        {selectedDepartment &&
          selectedSection && (
            <div className={s.result}>
              <strong>Куди:</strong>

              <br />

              {selectedDepartment.name}

              <br />

              {selectedSection.name}

              <br />
              <br />

              <strong>Скриньки:</strong>{" "}
              {keepResponsibleForMails
                ? "зберегти відповідальність"
                : "не зберігати"}

              <br />

              <strong>
                Телефони за посадою:
              </strong>{" "}
              {keepPhonesByPosition
                ? "залишити"
                : "не залишати"}

              <br />

              <strong>
                Перенести телефони:
              </strong>{" "}
              {transferPhones
                ? "так"
                : "ні"}
            </div>
          )}
      </div>
    </div>
  );
}

