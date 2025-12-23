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
    <div 
    >
      {columns.map((col) => (
        <Column key={col.id} column={col} />
      ))}
    </div>
  );
};