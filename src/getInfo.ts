import type { WidgetInfo } from "../types";

export function getInfo(data: WidgetInfo): WidgetInfo {
  return {
    ...data,
    config:
      typeof data.config === "string"
        ? data.config
        : JSON.stringify(data.config ?? {}),
  };
}