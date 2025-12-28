import { http } from "./http";
import type { Board } from "../types/board";

export const getBoard = async (boardId: string): Promise<Board> => {
  const res = await http.get<Board>(`/boards/${boardId}/view`);
  return res.data;
};