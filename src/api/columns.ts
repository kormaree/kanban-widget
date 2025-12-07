import { http } from "./http";

export const get = async (boardId: string) => {
  const res = await http.get(`/boards/${boardId}/columns`);
  return res.data;
};