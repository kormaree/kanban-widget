import { http } from "./http";

export interface PostColumnRequest {
  title: string;
  display_order: number;
  color: string | null;
  board_id: string;
}

export const createColumn = (data: PostColumnRequest) => {
  return http.post(`/columns/`, data);
};

export interface UpdateColumnRequest {
  title: string;
  display_order: number;
  color: string | null;
}

export const updateColumn = (columnId: string, data: UpdateColumnRequest) => {
  return http.patch(`/columns/${columnId}`, data);
};