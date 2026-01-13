import type { NodeProps } from "@xyflow/react";
import type { FC } from "react";

type WidgetInfo = {
  widgetId: number;
  userId: number;
  role: string;
  config: string;
  board: {
    id: number;
    name: string;
    parentId: number;
  };
};

declare function getInfo(data: WidgetInfo): WidgetInfo;

declare const KanbanWidgetNode: FC<NodeProps>;

export { KanbanWidgetNode, type WidgetInfo, getInfo };