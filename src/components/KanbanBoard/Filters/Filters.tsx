import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ru } from "date-fns/locale";
import { getBoardAssignees } from "../../../api/assignee";
import { useBoardStore } from "../../../store/boardStore";

import arrowIcon from "./images/Vector.svg";
import sortIcon from "./images/sort-vertical-02.svg";
import userIcon from "./images/user-profile-square.svg";
import barIcon from "./images/bar-chart-square-01.svg";
import calendarIcon from "./images/calendar-02.svg";
import messageIcon from "./images/message-alert-plus.svg";
import { TaskCard } from "../ColumnsArea/TaskCard";
import { Column } from "../ColumnsArea/Column";

export const Filter = ({ boardId }: { boardId: string }) => {

    const { filters, toggleFilterValue, setFilter } = useBoardStore();
    const board = useBoardStore(state => state.board);

    const priorities = [
        { value: "high", label: "высокий", textcolor: "#3789D5"},
        { value: "medium", label: "средний", textcolor: "#3789D5" },
        { value: "low", label: "низкий", textcolor: "#3789D5" },
    ];

    const [assignees, setList] = useState<any[]>([]);

    useEffect(() => {
        getBoardAssignees(boardId).then(res => setList(res.data));
      }, [boardId]);

    const hasFiltersSelected =
      filters.assignees.length > 0 ||
      filters.priorities.length > 0 ||
      filters.comments ||
      filters.columnIds.length > 0 ||
      filters.date;
    
    const filteredColumns = hasFiltersSelected
      ? board?.columns
          .map(col => {
            const tasks = col.tasks.filter(task => {
              if (
                filters.priorities.length &&
                !filters.priorities.includes(task.priority)
              ) return false;

              if (
                filters.assignees.length &&
                !task.assignees.some(a =>
                  filters.assignees.includes(a.id)
                )
              ) return false;

              if (filters.date) {
                if (!task.deadline) return false;

                const taskDateStr = task.deadline.split("T")[0];
                if (taskDateStr !== filters.date) return false;
              }

              if (filters.comments === "with" && task.comments.length === 0)
                return false;

              if (filters.comments === "without" && task.comments.length > 0)
                return false;

              return true;
            });

            return { ...col, tasks };
          })
          .filter(col => col.tasks.length > 0)
      : [];

    const showColumns = hasFiltersSelected && filters.columnIds.length > 0;

    return (
    <div style = {{
        padding: 26,
        display: "flex",
        gap: 21,
        fontFamily: "'Inter', sans-serif",
        boxSizing: "border-box",
    }}>
        <div
            style={{
                width: "315px",
                height: "790px",
                backgroundColor: "#FBFCFF",
                borderRadius: "20px",
                padding: "30px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "22px",
            }}
        >
            <div
                style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#969696",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "20px",
                }}
            >
                <img src={sortIcon} />
                свойства задач
            </div>

            <FilterSection icon={userIcon} title="исполнители">
              {assignees.map(u => (
                <div key={u.member_id} style={{ marginLeft: 24 }}>
                  <Checkbox
                    label={u.name}
                    colorText="#3789D5"
                    checked={filters.assignees.includes(u.member_id)}
                    onChange={() =>
                      toggleFilterValue("assignees", u.member_id)
                    }
                  />
                </div>
              ))}
            </FilterSection>

            <FilterSection icon={barIcon} title="приоритеты">
              {priorities.map(p => (
                <div key={p.value} style={{ marginLeft: 24 }}>
                  <Checkbox
                    label={p.label}
                    colorText="#3789D5"
                    checked={filters.priorities.includes(p.value)}
                    onChange={() =>
                      toggleFilterValue("priorities", p.value)
                    }
                  />
                </div>
              ))}
            </FilterSection>

            <FilterSection icon={calendarIcon} title="дедлайны">
              <DayPicker
                mode="single"
                locale={ru}
                weekStartsOn={1}
                selected={filters.date ? new Date(filters.date) : undefined}
                onSelect={date =>
                  setFilter("date", date ? date.toISOString().split("T")[0] : null)
                }
              />
        
                <style>
                {`
                    /* === МЕСЯЦ + ГОД === */
                    .rdp-caption_label {
                    font-size: 16px;
                    font-weight: 700;
                    color: #3789D5;
                    text-transform: lowercase;
                    margin-left: 8px;
                    }
        
                    /* === ДНИ НЕДЕЛИ === */
                    .rdp-weekday {
                    font-size: 16px;
                    font-weight: 500;
                    color: #333333;
                    text-transform: lowercase;
                    padding-bottom: 6px;
                    }
        
                    /* === КНОПКИ ДНЕЙ === */
                    .rdp-day_button {
                    background: none !important;
                    border: none !important;
                    box-shadow: none !important;
                    outline: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    width: 32px;
                    height: 32px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    }
        
                    /* === СТРЕЛКИ === */
                    .rdp-button_next,
                    .rdp-button_previous {
                    background: none !important;
                    border: none !important;
                    box-shadow: none !important;
                    padding: 4px;
                    cursor: pointer;
                    }
                `}
                </style>
            </FilterSection>
            <FilterSection icon={messageIcon} title="комментарии">
              <div style={{ marginLeft: 24 }}>
                <Checkbox
                  label="с комментариями"
                  colorText="#3789D5"
                  checked={filters.comments === "with"}
                  onChange={() =>
                    setFilter(
                      "comments",
                      filters.comments === "with" ? null : "with"
                    )
                  }
                />
              </div>

              <div style={{ marginLeft: 24 }}>
                <Checkbox
                  label="без комментариев"
                  colorText="#3789D5"
                  checked={filters.comments === "without"}
                  onChange={() =>
                    setFilter(
                      "comments",
                      filters.comments === "without" ? null : "without"
                    )
                  }
                />
              </div>
            </FilterSection>

        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}>
          <div
              style={{
                  width: "1231px",
                  height: "80px",
                  backgroundColor: "#FBFCFF",
                  borderRadius: "15px",
                  padding: "27px",
                  boxSizing: "border-box",
                  display: "flex",
                  gap: "23px",
              }}
          >
              <div
                  style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#969696",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginRight: "4px",
                  }}
              >
                  <img src={sortIcon} />
                  статусы задач
              </div>

              {board?.columns.map(col => (
                <Checkbox
                  key={col.id}
                  label={col.title}
                  colorText="#3789D5"
                  checked={filters.columnIds.includes(col.id)}
                  onChange={() =>
                    toggleFilterValue("columnIds", col.id)
                  }
                />
              ))}
          </div>

          <div
            style={
              showColumns
                ? { display: "flex", gap: 14 }
                : {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 14,
                    width: "1231px",
                  }
            }
          >
            {showColumns ? (
              filteredColumns
                ?.filter(col => filters.columnIds.includes(col.id))
                .map(col => (
                  <Column
                    key={col.id}
                    column={col}
                    height={"690px"}
                  />
                ))
            ) : (
              filteredColumns?.flatMap(col =>
                col.tasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
              )
            )}
          </div>
        </div>
    </div>
  );
};

const FilterSection = ({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px"}}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
            all: "unset",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#3789D5",
            fontWeight: 600,
            fontSize: "18px",
            cursor: "pointer",
            marginBottom: 10,
        }}
        >
        <img src={icon} />

        <span>{title}</span>

        <img
            src={arrowIcon}
            style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            opacity: 0.6,
            }}
        />
        </button>

      {open && children && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const Checkbox = ({
  label,
  colorText,
  checked,
  onChange,
}: {
  label: string;
  colorText: string;
  checked: boolean;
  onChange: () => void;
}) => {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "16px",
        cursor: "pointer",
        userSelect: "none",
        fontWeight: 600,
        color: colorText,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ display: "none" }}
      />

      <span
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "6px",
          border: "2px solid #3789D5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked && (
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRight: "2px solid #3789D5",
              borderBottom: "2px solid #3789D5",
              transform: "rotate(45deg)",
              marginBottom: "3px",
            }}
          />
        )}
      </span>

      {label}
    </label>
  );
};
