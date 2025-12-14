import { create } from "zustand";
import * as api from "../api/columns";
import type { Column } from "../types/column";
import type { Task } from "../types/task";

interface BoardStore {
  columns: Column[];
  tasks: Task[];
  loadBoard: (boardId: string) => Promise<void>;
}

//Тут явно какая-то херня нагенерилась, надо править

export const useBoardStore = create<BoardStore>((set) => ({
  columns: [],
  tasks: [],

  async loadBoard(boardId: string) {
    const columns = await api.get(boardId);
    const tasks = await api.get(boardId);
    set({ columns, tasks });
  },
}));