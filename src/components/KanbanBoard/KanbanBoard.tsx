import { useEffect } from "react";
import { Header } from "./Header/Header";
import { ColumnsArea } from "./ColumnsArea/ColumnsArea";
import { useBoardStore } from "../../store/boardStore";

export const KanbanBoard = ({ boardId }: { boardId: string }) => {
  const loadBoard = useBoardStore((s) => s.loadBoard);

  useEffect(() => {
    loadBoard(boardId);
  }, [boardId]);

  return (
    <div className="kanban-board">
      <Header />
      <ColumnsArea />
    </div>
  );
};