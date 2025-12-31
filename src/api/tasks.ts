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

export const createTask = (data: PostTaskRequest) => {
  return http.post(`/tasks`, data);
};

export const deleteTask = (taskId: string) => {
  return http.delete(`/tasks/${taskId}`);
};

export interface UpdateTaskRequest {
  priority?: "low" | "medium" | "high";
  deadline?: string,
  display_order?: number,
  column_id?: string,
  is_completed?: true,
  color?: string
}

export const updateTask = (taskId: string, data: UpdateTaskRequest) => {
  return http.patch(`/tasks/${taskId}`, data);
};