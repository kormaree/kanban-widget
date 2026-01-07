import { useState } from "react";
import { createTask } from "../../../api/tasks";
import { useBoardStore } from "../../../store/boardStore";

import type { Column as ColumnType } from "../../../types/board";
import { TaskCard } from "./TaskCard";
import filterIcon from './images/filter.svg';
import { useDroppable } from "@dnd-kit/core";

export const Column = ({ column, height }: { column: ColumnType, height: string }) => {

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
      board.columns.map(col => {
        if (col.id !== column.id) return col;

        const minOrder =
          col.tasks.length > 0
            ? Math.min(...col.tasks.map(t => t.display_order))
            : 0;

        return {
          ...col,
          tasks: [
            { ...newTask, display_order: minOrder - 1 },
            ...col.tasks,
          ],
        };
      })
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
      flex: "0 0 370px",
      width: "370px",
      height: height,
      backgroundColor:"#F4F7FC",
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "25px 25px 0px 25px",
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
          padding: "0px 25px 0px 25px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#8D9EAD",
          fontSize: "16px",
          fontWeight: 500,
          display: "flex",
          alignItems: "flex-start",
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

      <div ref={setNodeRef} 
      style={{
        backgroundColor: hexToRgba(column.color, 0.3), 
        borderRadius: "20px", 
        border: `3px solid ${column.color}`, 
        width: "calc(100% - 28px)", 
        height: 625, 
        padding: 12,
        overscrollBehavior: "contain",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        }}>
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
          id={column.id}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "4px",


          }}
        >
          {column.tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};

const hexToRgba = (hex: string, alpha: number) => {
  if (hex === "none" || hex === null) return "none";
  
  const cleaned = hex.replace("#", "");

  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};