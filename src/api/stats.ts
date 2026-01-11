import { http } from "./http";

import type {
  BoardStatsSummary,
  BoardProductivity,
  BoardPriorities,
  BoardWorkload,
  BoardTimeByUser,
  BoardCompletedByUser
} from "../types/stats";

export function getBoardStatsSummary(boardId: string) {
  return http.get<BoardStatsSummary>(`/boards/${boardId}/stats/summary`);
}

export function getBoardProductivitySummary(boardId: string) {
  return http.get<BoardProductivity>(`/boards/${boardId}/stats/productivity`);
}

export function getBoardProductivityTimeline(
  boardId: string,
  params: {
    date_from: string;
    date_to: string;
    step?: "day" | "week";
  }
) {
  return http.get<BoardProductivity>(
    `/boards/${boardId}/stats/productivity/timeline`,
    { params }
  );
}

export function getBoardPriorities(boardId: string) {
  return http.get<BoardPriorities>(`/boards/${boardId}/stats/priorities`);
}

export function getBoardWorkload(
  boardId: string,
  params?: { from?: string; to?: string }
) {
  return http.get<BoardWorkload>(`/boards/${boardId}/stats/workload`, { params });
}

export function getBoardTimeByUser(boardId: string) {
  return http.get<BoardTimeByUser>(`/boards/${boardId}/stats/time_by_user`);
}

export function getBoardCompletedByUser(boardId: string) {
  return http.get<BoardCompletedByUser>(`/boards/${boardId}/stats/completed_tasks_by_user`);
}
