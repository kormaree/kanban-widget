import { http } from "./http";

export type CreateCommentRequest = {
  content: string;
  task_id: string;
};

export const createComment = (data: CreateCommentRequest) => {
  return http.post(`/comments/`, data);
};