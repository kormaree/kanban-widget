import { http } from "./http";
import type { Column } from "../types/column";

export const getColumns = async (boardId: string): Promise<Column[]> => {
  const res = await http.get<Column[]>(`/boards/${boardId}/columns`);
  return res.data;
};