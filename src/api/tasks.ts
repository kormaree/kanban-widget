import { http } from "./http";

export interface ReorderColumnsRequest {
  columns: {
    column_id: string;
    task_ids: string[];
  }[];
}

export const reorderTasks = (boardId: string, data: ReorderColumnsRequest) => {
  return http.post(`/boards/${boardId}/reorder`, data);
};
export interface PostTaskRequest {
  title: string;
  column_id: string
}

export const create = (data: PostTaskRequest) => {
  return http.post(`/tasks`, data);
};