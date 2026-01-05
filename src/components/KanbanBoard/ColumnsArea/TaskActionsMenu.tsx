import { useEffect, useRef, useState } from "react";
import type { Task } from "../../../types/board";
import { deleteTask, updateTask } from "../../../api/tasks";
import { useBoardStore } from "../../../store/boardStore";
import { getBoardAssignees, addTaskAssignee, createBoardMember } from "../../../api/assignee";

import calendarIcon from './images/calendar-02.svg';
import messageIcon from './images/message.svg';
import pencilIcon from './images/pencil-02.svg';
import userIcon from './images/user-profile-square.svg';
import barIcon from './images/bar-chart-square-01.svg';
import trashIcon from './images/trash-02.svg';
import barIconGreen from './images/bar-chart-square-green.svg';
import barIconOrange from './images/bar-chart-square-orange.svg';
import barIconRed from './images/bar-chart-square-red.svg';
import { createComment } from "../../../api/comment";

type Props = {
  task: Task;
  onClose: () => void;
};

type View =
  | "menu"
  | "assignee"
  | "priority"
  | "deadline"
  | "comment"
  | "rename"

type Priority = "low" | "medium" | "high";

const TASK_COLORS = [
  { palette: "#FF9C9C", task: "#FFEDED" },
  { palette: "#9CEFA7", task: "#F0FFEC" },
  { palette: "#BBA6EF", task: "#EDECFF" },
  { palette: "#FF9CE5", task: "#FFECFF" },
  { palette: "#FFE69C", task: "#FFFDE6" },
];

export function TaskActionsMenu({ task, onClose }: Props) {
  const { removeTask, updateTaskInStore, addAssigneeToTask } = useBoardStore();
  const [view, setView] = useState<View>("menu");
  const ref = useRef<HTMLDivElement>(null);

  const handleDelete = async () => {
    deleteTask(task.id);
    removeTask(task.id);
    onClose();
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        view === "menu" ? onClose() : setView("menu");
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [view, onClose]);

  const handleChangeColor = async (color: string) => {
    await updateTask(task.id, { color });
    updateTaskInStore(task.id, { color });
  };

  const handleChangePriority = async (priority: Priority) => {
    await updateTask(task.id, { priority });
    updateTaskInStore(task.id, { priority });
  };

  const handleChangeAssign = async (member: {
    member_id: string;
    name: string;
  }) => {
    await addTaskAssignee(task.id, member.member_id);

    addAssigneeToTask(task.id, {
      id: member.member_id,
      name: member.name,
    });
  };

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: 60,
        left: 10,
        width: 285,
        background: "#fff",
        paddingBottom: "15px",
        paddingTop: "20px",
        borderRadius: 20,
        boxShadow: "5px 5px 5px 5px rgba(0,0,0,0.05)",
        zIndex: 1,
      }}
    >
      {view === "menu" && (
        <Menu
          onSelect={setView}
          onDelete={handleDelete}
          onChangeColor={handleChangeColor}
        />
      )}

      {view === "assignee" && (
        <AssigneeSection
            boardId={task.board_id}
            onChangeAssign={handleChangeAssign}
        />
      )}

      {view === "priority" && (
        <PrioritySection
          onChangePriority={handleChangePriority}
        />
      )}

      {view === "deadline" && (
        <DeadlineSection

        />
      )}

      {view === "comment" && (
        <CommentSection taskId={task.id} />
      )}

      {view === "rename" && (
          <RenameSection

          />
      )}
    </div>
  );
}

function Menu({
  onSelect,
  onDelete,
  onChangeColor,
}: {
  onSelect: (v: View) => void;
  onDelete: () => void;
  onChangeColor: (color: string) => void;
}) {
  return (
    <>
      <MenuItem label="Исполнитель" icon={userIcon} onClick={() => onSelect("assignee")} />
      <MenuItem label="Приоритет" icon={barIcon} onClick={() => onSelect("priority")} />
      <MenuItem label="Дедлайн" icon={calendarIcon} onClick={() => onSelect("deadline")} />
      <MenuItem label="Комментарий" icon={messageIcon} onClick={() => onSelect("comment")} />
      <MenuItem label="Переименовать" icon={pencilIcon} onClick={() => onSelect("rename")} />

      <hr style={{ borderTop: "1px solid #E3E5EF"}} />

      <div style={{ padding: "0 24px" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#B5B5B5",
            marginBottom: 10,
          }}
        >
          ЦВЕТ ЗАДАЧИ
        </div>

        <div style={{ display: "flex", gap: 13 }}>
          {TASK_COLORS.map(({ palette, task }) => (
            <button
              key={palette}
              onClick={() => onChangeColor(task)}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: palette,
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      <hr style={{ borderTop: "1px solid #E3E5EF" }} />

      <MenuItem
        label="Удалить"
        icon={trashIcon}
        danger
        onClick={onDelete}
      />
    </>
  );
}


function MenuItem({
  label,
  icon,
  onClick,
  danger,
}: {
  label: string;
  icon?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        background: "none",
        border: "none",
        textAlign: "left",
        fontWeight: "500",
        marginLeft: "24px",
        fontSize: 17,
        display: "flex",
        gap: 10,
        padding: "8px",
        cursor: "pointer",
        fontFamily: "'Inter', sans-serif",
        color: danger ? "#F25050" : "#5B6471",
      }}
    >
        
    {icon && (
        <img
          src={icon}
          style={{
            width: 21,
            height: 21,
          }}
        />
    )}

    {label}

    </button>
  );
}


function AssigneeSection({
  boardId,
  onChangeAssign,
}: {
  boardId: string;
  onChangeAssign: (member: { member_id: string; name: string }) => void;
}) {
  const [list, setList] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  
  useEffect(() => {
    getBoardAssignees(boardId).then(res => setList(res.data));
  }, [boardId]);

  const handleAdd = async () => {
    if (!name.trim()) return;

    const { data: member } = await createBoardMember({
      board_id: boardId,
      name: name.trim(),
      role: role.trim(),
    });

    setList(prev => [...prev, member]);

    setName("");
    setRole("");
    setIsAdding(false);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div style={{
        marginLeft: 24,
        fontSize: 18,
        fontWeight: 600,
        color: "#4B4F54",
        marginBottom: 17,
      }}>
        Исполнитель
      </div>

      <hr style={{ borderTop: "1px solid #E3E5EF"}} />

      {list.map((u) => (
        <button
          onClick={() => onChangeAssign(u)}
          key={u.member_id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
            marginLeft: 22,
            cursor: "pointer",
            border: "none",
            backgroundColor: "#fff",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#ADADAD",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {u.name[0].toUpperCase()}
          </div>

          <div>
            <div style={{ fontWeight: 500, fontSize: 20, color: "#000" }}>{u.name}</div>

            {u.role && (
              <div style={{ fontSize: 12, color: "#888888", display: "flex", justifyContent: "left" }}>
                {u.role}
              </div>
            )}
          </div>
        </button>
      ))}

      {isAdding && (
        <>
          <hr style={{ borderTop: "1px solid #E3E5EF"}} />

          <input
            value={name}
            style={{border: "none", marginLeft: 22, fontWeight: 500, fontSize: 18, borderBottom: "2px solid #E3E5EF", width: 230}}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя"
          />

          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{border: "none", marginLeft: 22, fontWeight: 500, fontSize: 18, borderBottom: "2px solid #E3E5EF", width: 230}}
            placeholder="Роль"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
        </>
      )}

      <hr style={{ borderTop: "1px solid #E3E5EF"}} />

      <button
        onClick={() => setIsAdding(true)}
        style={{
          background: "none",
          border: "none",
          color: "#3789D5",
          cursor: "pointer",
          fontWeight: 500,
          fontSize: 16,
          marginLeft: 10,
        }}
      >
        + добавить участника в проект
      </button>
    </div>
  );
}

function PrioritySection({
  onChangePriority,
}: {
  onChangePriority: (priority: Priority) => void;
}) {
  const priorities = [
    { value: "high" as Priority, label: "высокий", backgroundcolor: "#FFC7C7", textcolor: "#FF2F2F", img: barIconRed },
    { value: "medium" as Priority, label: "средний", backgroundcolor: "#FFECBD", textcolor: "#E89300", img: barIconOrange },
    { value: "low" as Priority, label: "низкий", backgroundcolor: "#CDFFC2", textcolor: "#30C100", img: barIconGreen },
  ];

  return (
    <div>
      <div style={{
        marginLeft: 24,
        fontSize: 18,
        fontWeight: 600,
        color: "#4B4F54",
        marginBottom: 17,
        fontFamily: "'Inter', sans-serif",
      }}>
        Приоритет
      </div>

      <hr style={{ borderTop: "1px solid #E3E5EF"}} />

      <div style={{
        marginLeft: 24,
        fontSize: 12,
        fontWeight: 500,
        color: "#B5B5B5",
        marginBottom: 14,
        fontFamily: "'Inter', sans-serif",
      }}>
        УРОВЕНЬ ВАЖНОСТИ ЗАДАЧИ
      </div>

      {priorities.map((priority) => (
        <button
          key={priority.value}
          onClick={() => onChangePriority(priority.value)}
          style={{
            marginLeft: 24,
            width: 106,
            border: "none",
            borderRadius: 5,
            textAlign: "left",
            display: "flex",
            gap: 4,
            padding: 4,
            marginBottom: 12,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 16,
            color: priority.textcolor,
            backgroundColor: priority.backgroundcolor
          }}
        >
          <img
            src={priority.img}
            style={{
              width: "19px",
              height: "19px",
            }}
          />
          {priority.label}
        </button>
      ))}
    </div>
  );
}

function DeadlineSection({
  //onChangeDeadline,
}: {
  //onChangeDeadline: (Deadline: string) => void;
}) {

  return (
    <div>
      <div style={{
        marginLeft: 24,
        fontSize: 18,
        fontWeight: 600,
        color: "#4B4F54",
        marginBottom: 17,
        fontFamily: "'Inter', sans-serif",
      }}>
        Дедлайн
      </div>

      <hr style={{ borderTop: "1px solid #E3E5EF"}} />

    </div>
  );
}

function CommentSection({ taskId }: { taskId: string }) {

  const [comment, setComment] = useState("");
  const { addCommentToTask } = useBoardStore();

  const handleCreate = async () => {
      if (!comment.trim()) {
        setComment("");
        return;
      }

      try {
        const { data: newComment } = await createComment({
          content: comment.trim(),
          task_id: taskId,
        });

        addCommentToTask(taskId, newComment);
      } finally {
        setComment("");
      }
    };

  return (
    <div>
      <div style={{
        marginLeft: 24,
        fontSize: 18,
        fontWeight: 600,
        color: "#4B4F54",
        marginBottom: 17,
        fontFamily: "'Inter', sans-serif",
      }}>
        Комментарий
      </div>

      <hr style={{ borderTop: "1px solid #E3E5EF"}} />

            <div style={{
        marginLeft: 24,
        fontSize: 12,
        fontWeight: 500,
        color: "#B5B5B5",
        marginBottom: 14,
        fontFamily: "'Inter', sans-serif",
      }}>
        КОММЕНТАРИЙ К ВЫБРАННОЙ ЗАДАЧЕ
      </div>

      <input
        autoFocus
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onBlur={handleCreate}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleCreate();
          if (e.key === "Escape") setComment("");
        }}
        placeholder="Введите комментарий..."
        style={{
          padding: 16,
          width: "200px",
          border: "1px solid #A4D1F4 ",
          boxShadow: "5px 5px 5px 5px rgba(209, 232, 250, 0.4);",
          marginLeft: 24,
          outline: "none",
          fontSize: 16,
          fontWeight: 500,
          fontFamily: "'Inter', sans-serif",
        }}
      />
    </div>
  );
}

function RenameSection({
  //onChangeDeadline,
}: {
  //onChangeDeadline: (Deadline: string) => void;
}) {

  return (
    <div>
      <div style={{
        marginLeft: 24,
        fontSize: 18,
        fontWeight: 600,
        color: "#4B4F54",
        marginBottom: 17,
        fontFamily: "'Inter', sans-serif",
      }}>
        Переименовать
      </div>

      <hr style={{ borderTop: "1px solid #E3E5EF"}} />

    </div>
  );
}