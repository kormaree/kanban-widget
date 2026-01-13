import { KanbanBoard } from "../KanbanBoard/KanbanBoard";
import { NodeResizer } from "@xyflow/react";
import { type NodeProps } from "@xyflow/react";
import { useEffect, useState, useRef } from "react";
import { http } from "../../api/http";
import { platformHttp } from "../../api/platformHttp";

type WidgetNodeData = {
  widgetId?: number;
  config?: string;
  board?: {
    id: number;
    name: string;
    parentId: number;
  };
  userId?: number;
  role?: string;
};

export function KanbanWidgetNode(props: NodeProps) {
  const { selected, dragging } = props;
  const data = (props.data ?? {}) as WidgetNodeData;

  const initInFlightRef = useRef(false);
  const createdBoardIdRef = useRef<string | undefined>(undefined);
  const patchedRef = useRef(false);

  const [parsedConfig, setParsedConfig] = useState<Record<string, any> | undefined>(undefined);

  useEffect(() => {
    try {
      if (typeof data.config === "string") {
        const trimmed = data.config.trim();

        if (trimmed === "") {
          setParsedConfig({});
          return;
        }

        const parsed = JSON.parse(trimmed);
        setParsedConfig(
          parsed && typeof parsed === "object" ? parsed : {}
        );
        return;
      }

      if (data.config && typeof data.config === "object") {
        setParsedConfig(data.config as Record<string, any>);
        return;
      }

      setParsedConfig({});
    } catch (e) {
      console.warn("[KanbanWidgetNode] failed to parse config JSON", data?.config);
      setParsedConfig({});
    }
  }, [data.config]);

  const initialKanbanBoardId = parsedConfig?.kanbanBoardId as string | undefined;
  const [localKanbanBoardId, setLocalKanbanBoardId] = useState<string | undefined>(initialKanbanBoardId);

  useEffect(() => {
    if (initialKanbanBoardId && initialKanbanBoardId !== localKanbanBoardId) {
      setLocalKanbanBoardId(initialKanbanBoardId);
    }
  }, [initialKanbanBoardId, localKanbanBoardId]);

  const kanbanBoardId = localKanbanBoardId;

  useEffect(() => {
    if (localKanbanBoardId) return;
    if (kanbanBoardId) return;
    if (!data?.widgetId) return;
    if (parsedConfig === undefined) return;

    (async () => {
      try {
        if (parsedConfig?.kanbanBoardId) {
          return;
        }

        if (initInFlightRef.current) return;
        initInFlightRef.current = true;

        if (createdBoardIdRef.current) {
          setLocalKanbanBoardId(createdBoardIdRef.current);
          return;
        }

        const res = await http.post("/boards", {
          title: "Kanban Board",
        });

        const newKanbanBoardId = res.data?.id;
        if (!newKanbanBoardId) {
          throw new Error("Backend did not return board id");
        }

        const newKanbanBoardIdStr = String(newKanbanBoardId);
        createdBoardIdRef.current = newKanbanBoardIdStr;

        if (data.widgetId && !patchedRef.current) {
          patchedRef.current = true;
          try {
            await platformHttp.patch(`/api/widget/${data.widgetId}`, {
              config: {
                ...(parsedConfig ?? {}),
                kanbanBoardId: newKanbanBoardIdStr,
              },
            });
          } catch (e) {
            console.error("[KanbanWidgetNode] failed to persist kanbanBoardId in widget config", e);
          }
        }

        setLocalKanbanBoardId(newKanbanBoardIdStr);

      } catch (err) {
        console.error("[KanbanWidgetNode] failed to init kanban board", err);
      }
    })();

    return () => { };
  }, [kanbanBoardId, data?.widgetId, parsedConfig]);

  return (
    <>
      <NodeResizer
        handleStyle={{ width: 8, height: 8 }}
        isVisible={Boolean(selected)}
        minWidth={800}
        minHeight={1024}
      />

      <div
        onWheelCapture={(e) => { //Это нужно для скролла колонок
          e.stopPropagation();
        }}
        style={{
          width: props.width ?? 1620,
          height: props.height ?? 1024,
          minWidth: 1620,
          minHeight: 1024,
          background: selected ? "rgba(205, 221, 233, 0.4)" : "rgba(205, 221, 233, 0.4)",
          borderRadius: 20,
          overflow: "hidden",
          opacity: dragging ? 0.8 : 1,
        }}
      >
        {!kanbanBoardId && (
          <div style={{
              padding: 16,
              color: "#555",
              fontSize: 18,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "'Inter', sans-serif"
            }}>
            Initializing Kanban…
          </div>
        )}
        {kanbanBoardId && <KanbanBoard boardId={kanbanBoardId} />}
      </div>
    </>
  );
}
