import { useBoardColumns } from "../../../store/boardSelectors";
import { Column } from "./Column";

export const ColumnsArea = () => {
  
  const columns = useBoardColumns();

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