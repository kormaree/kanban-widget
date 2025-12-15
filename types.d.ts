declare module "kanban-widget" {
  import { FC } from "react";
  
  export interface KanbanWidgetNodeProps {
    boardId: string;
  }
  
  export const KanbanWidgetNode: FC<KanbanWidgetNodeProps>;
}