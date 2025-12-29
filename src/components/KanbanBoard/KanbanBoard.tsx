import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  pointerWithin,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { Header } from "./Header/Header";
import { ColumnsArea } from "./ColumnsArea/ColumnsArea";
import { useBoardStore } from "../../store/boardStore";
import { reorderTasks } from "../../api/tasks";
import type { Task, Column } from "../../types/board";
import { TaskCard } from "./ColumnsArea/TaskCard";

const moveTask = (
  columns: Column[],
  activeId: string,
  overId: string
): Column[] => {
  let sourceCol: Column | undefined;
  let targetCol: Column | undefined;

  columns.forEach(col => {
    if (col.tasks.some(t => t.id === activeId)) sourceCol = col;
    if (col.tasks.some(t => t.id === overId) || col.id === overId) {
      targetCol = col;
    }
  });

  if (!sourceCol || !targetCol) return columns;

  const sourceTasks = [...sourceCol.tasks];
  const taskIndex = sourceTasks.findIndex(t => t.id === activeId);
  const [task] = sourceTasks.splice(taskIndex, 1);

  const targetTasks =
    sourceCol.id === targetCol.id
      ? sourceTasks
      : [...targetCol.tasks];

  const insertIndex =
    overId === targetCol.id
      ? targetTasks.length
      : targetTasks.findIndex(t => t.id === overId);

  targetTasks.splice(insertIndex, 0, task);

  return columns.map(col => {
    if (col.id === sourceCol!.id) {
      return {
        ...col,
        tasks: sourceCol!.id === targetCol!.id ? targetTasks : sourceTasks,
      };
    }

    if (col.id === targetCol!.id) {
      return {
        ...col,
        tasks: targetTasks,
      };
    }

    return col;
  });
};

export const KanbanBoard = ({ boardId }: { boardId: string }) => {
  const { board, loadBoard, updateColumns } = useBoardStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    loadBoard(boardId);
  }, [boardId]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (!board) return;

    for (const column of board.columns) {
      const task = column.tasks.find(t => t.id === active.id);
      if (task) {
        setActiveTask(task);
        break;
      }
    }
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveTask(null);

    if (!over || !board || active.id === over.id) return;

    const newColumns = moveTask(
      board.columns,
      active.id as string,
      over.id as string
    );

    updateColumns(newColumns);

    await reorderTasks(boardId, {
      columns: newColumns.map(col => ({
        column_id: col.id,
        task_ids: col.tasks.map(t => t.id),
      })),
    });
  };

  if (!board) {
    return <div>Загрузка...</div>;
  }

  const taskIds = board.columns.flatMap(col =>
    col.tasks.map(task => task.id)
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <SortableContext items={taskIds}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            borderRadius: "20px",
          }}
        >
          <Header />
          <ColumnsArea columns={board.columns} />
        </div>npm install @dnd-kit/modifiers
      </SortableContext>

      <DragOverlay modifiers={[snapCenterToCursor]} dropAnimation={null}>
        {activeTask && (
          <div style={{ pointerEvents: "none" }}>
            <TaskCard task={activeTask} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
