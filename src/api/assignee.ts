import { http } from "./http";

export type BoardMember = {
  board_id: string;
  name: string;
  role: string;
};

export const createBoardMember = (data: BoardMember) =>
  http.post<BoardMember>(`/members/`, data);

type Member = {
  member_id: string,
  name: string,
  role: string
};

export const getBoardAssignees = (boardId: string) =>
  http.get<Member[]>(`/members/${boardId}`);

export const addTaskAssignee = (taskId: string, memberId: string) =>
  http.post(`/tasks/${taskId}/assignees`, { user_id: memberId });