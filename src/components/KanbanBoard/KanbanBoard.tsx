import { useEffect } from "react";
import { Header } from "./Header/Header";
import { ColumnsArea } from "./ColumnsArea/ColumnsArea";
import { useBoardStore } from "../../store/boardStore";

export const KanbanBoard = ({ boardId }: { boardId: string }) => {
  const loadBoard = useBoardStore((s) => s.loadBoard);

  useEffect(() => {
    loadBoard(boardId);
  }, [boardId, loadBoard]);

  return (
    <div style={{ 
      flex: 1,
      display: "flex", 
      flexDirection: "column",
      width: "100%",
      height: "100%",
      borderRadius: "20px", 
     }}>
      <Header />
      <ColumnsArea />
    </div>
  );
};