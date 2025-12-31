import { http } from "./http";

export type BoardMember = {
  board_id: string;
  name: string;
  role: string;
};

export const createBoardMember = (data: BoardMember) =>
  http.post<BoardMember>(`/members/`, data);

export type TaskAssignee = {
  id: string;
};

export const getTaskAssignees = (taskId: string) =>
  http.get<TaskAssignee[]>(`/tasks/${taskId}/assignees`);

export const addTaskAssignee = (taskId: string, memberId: string) =>
  http.post<TaskAssignee>(`/tasks/${taskId}/assignees`, {member_id: memberId});