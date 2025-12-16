import { useBoardStore } from "../../../store/boardStore";
import { Column } from "./Column";

export const ColumnsArea = () => {
  const columns = useBoardStore((s) => s.columns);

  return (
    <div className="columns-area drag-handle">
      {columns.map((col) => (
        <Column key={col.id} column={col} />
      ))}
    </div>
  );
};