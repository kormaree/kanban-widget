import { ResizableContainer } from "../ResizableContainer/ResizableContainer";
import { KanbanBoard } from "../KanbanBoard/KanbanBoard";

export const KanbanWidgetNode = ({ boardId }: { boardId: string }) => {
  return (
    <ResizableContainer>
      <KanbanBoard boardId={boardId} />
    </ResizableContainer>
  );
};