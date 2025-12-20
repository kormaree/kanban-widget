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
        minWidth={300}
        minHeight={200}
      />

    <div
      style={{
        width: "100%",
        height: "100%",
        background: selected ? "#f8f9ff" : "white",
        borderRadius: 8,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        opacity: dragging ? 0.8 : 1,
      }}
    >
      <KanbanBoard boardId={boardId} />
    </div>
    </>
  );
}
