import { useBoardStore } from "../../../store/boardStore";
import { Column } from "./Column";

//Временные колонки
const columns = [
  {
    id: "backlog",
    title: "Бэклог",
    position: 0
  },
  {
    id: "todo",
    title: "Сделать", 
    position: 1
  },
  {
    id: "in-progress",
    title: "В процессе",
    position: 2
  },
  {
    id: "done",
    title: "Готово",
    position: 3
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