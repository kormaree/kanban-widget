import { useBoardStore } from "../../../store/boardStore";
import { Column } from "./Column";
import type { Task } from "../../../types/task";


//Временные колонки
const columns = [
  {
    id: "backlog",
    title: "Бэклог",
    position: 0,
    display_order: 0,
    color: "#F59E0B",
    board_id: "board-1",
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "todo",
    title: "Сделать", 
    position: 1,
    display_order: 1,
    color: "#3B82F6",
    board_id: "board-1",
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "in-progress",
    title: "В процессе",
    position: 2,
    display_order: 2,
    color: "#8B5CF6",
    board_id: "board-1",
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "done",
    title: "Готово",
    position: 3,
    display_order: 3,
    color: "#10B981",
    board_id: "board-1",
    created_at: "2024-01-15T10:30:00Z"
  }
];

export const ColumnsArea = () => {
  //  Пока убрала пока нет апи
  //const columns = useBoardStore((s) => s.columns);

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      fontSize: "24px",
      lineHeight: "100%",
      color: "#000000",
      display: "flex",
      padding: "30px",
      gap: "26px",
      height: "100%",
      backgroundColor: "rgba(205, 221, 233, 0.3)",
    }}>
      {columns.map((col) => (
        <Column key={col.id} column={col} />
      ))}
    </div>
  );
};