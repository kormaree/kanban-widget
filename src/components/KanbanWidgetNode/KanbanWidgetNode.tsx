import { NodeResizer } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { KanbanBoard } from "../KanbanBoard/KanbanBoard";

export function KanbanWidgetNode({ data, selected }: NodeProps) {
  const { boardId } = data as { boardId: string };

  return (
    <div
      className="kanban-node"
      style={{
        width: "100%",
        height: "100%",
        background: "white",
        borderRadius: 8,
        overflow: "hidden",
        border: selected ? "2px solid #2563eb" : "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={400}
        minHeight={300}
      />
      <KanbanBoard boardId={boardId} />
    </div>
  );
}