import { NodeResizer } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";

import { KanbanBoard } from "../KanbanBoard/KanbanBoard";

export function KanbanWidgetNode({ data, selected }: NodeProps) {
  const { boardId, width, height } = data as {
    boardId: string;
    width?: number;
    height?: number;
  };

  return (
    <div
      style={{
        width: width ?? 800,
        height: height ?? 600,
        background: "white",
        borderRadius: 8,
        overflow: "hidden",
        border: selected ? "2px solid #2563eb" : "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NodeResizer isVisible={selected} minWidth={400} minHeight={300} />

      <div className="drag-handle" style={{ height: 32, cursor: "grab" }}>
        Kanban
      </div>

      <div className="nodrag" style={{ flex: 1 }}>
        <KanbanBoard boardId={boardId} />
      </div>
    </div>
  );
}

