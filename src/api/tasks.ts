import { http } from "./http";
import type { Task } from "../types/task";

export const getTasks = async (boardId: string): Promise<Task[]> => {
  const res = await http.get<Task[]>(`/boards/${boardId}/tasks`);
  return res.data;
};