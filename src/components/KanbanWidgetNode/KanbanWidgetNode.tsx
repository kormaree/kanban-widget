import { KanbanBoard } from "../KanbanBoard/KanbanBoard";
import { NodeResizer, type NodeProps } from "@xyflow/react";

type KanbanWidgetNodeData = {
  boardId: string;
};

export function KanbanWidgetNode({
  data,
  selected,
  dragging,
}: NodeProps) {
  const { boardId } = data as KanbanWidgetNodeData;

  return (
    <>
      <NodeResizer
        handleStyle={{ width: 8, height: 8 }}
        isVisible={selected}
        minWidth={800}
        minHeight={1024}
      />

    <div
      style={{
        width: "100%",
        height: "100%",
        background: selected ? "rgba(205, 221, 233, 0.3)" : "rgba(205, 221, 233, 0.3)",
        borderRadius: 20,
        overflow: "hidden",
        opacity: dragging ? 0.8 : 1,
      }}
    >
      <KanbanBoard boardId={boardId} />
    </div>
    </>
  );
}
