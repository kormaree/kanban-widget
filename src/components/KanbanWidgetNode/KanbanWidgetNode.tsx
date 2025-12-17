import type { NodeProps } from "@xyflow/react";
import { KanbanBoard } from "../KanbanBoard/KanbanBoard";

export function KanbanWidgetNode({ data }: NodeProps) {
  const { boardId } = data as { boardId: string };

  return (
    <div style={{
        width: "100%",
        height: "100%",
        background: "white",
        borderRadius: 8,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
      <KanbanBoard boardId={boardId} />
    </div>
  );
}