import { useState } from "react";
import { create as createTask } from "../../../api/tasks";
import { useBoardStore } from "../../../store/boardStore";

import type { Column as ColumnType } from "../../../types/board";
import { TaskCard } from "./TaskCard";
import filterIcon from './images/filter.svg';
import { useDroppable } from "@dnd-kit/core";

export const Column = ({ column }: { column: ColumnType }) => {

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const { setActiveView, updateColumns, board } = useBoardStore();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) {
      setIsCreating(false);
      setTitle("");
      return;
    }

    try {
      const { data: newTask } = await createTask({
        title: title.trim(),
        column_id: column.id,
      });

      if (!board) return;

      updateColumns(
        board.columns.map(col =>
          col.id === column.id
            ? { ...col, tasks: [...col.tasks, newTask] }
            : col
        )
      );
    } finally {
      setIsCreating(false);
      setTitle("");
    }
  };

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      width: "370px",
      height: "748px",
      backgroundColor: "#F4F7FC",
      borderRadius: "20px",
      padding: "25px",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <h3 style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: 600,
            color: "#000000",
          }}>
            {column.title}
          </h3>
          <span style={{
            fontSize: "22px",
            color: "#3789D5",
          }}>
            {column.tasks.length}
          </span>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#3789D5",
            fontSize: "44px",
          }}>
          +
        </button>
      </div>
      <button
        onClick={() => setActiveView("sort")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#8D9EAD",
          fontSize: "16px",
          fontWeight: 500,
          display: "flex",
          alignItems: "flex-start",
          padding: "0px",
          marginBottom: '8px'
        }}>
          <img 
            src={filterIcon} 
            style={{ 
              width: "20px", 
              height: "20px"
            }} 
          />
          фильтровать
      </button>

      {isCreating && (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "15px",
            padding: "15px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.06)",
          }}
        >
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleCreate}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") {
                setIsCreating(false);
                setTitle("");
              }
            }}
            placeholder="Введите название задачи"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: "18px",
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </div>
      )}

      <div
        ref={setNodeRef}
        id={column.id}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "4px",
          overscrollBehavior: "contain",

          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {column.tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};