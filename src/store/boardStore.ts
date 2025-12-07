import { create } from "zustand";
import * as api from "../api";
import { Column } from "../types/column";
import { Task } from "../types/task";

interface BoardStore {
  columns: Column[];
  tasks: Task[];
  loadBoard: (boardId: string) => Promise<void>;
}

export const useBoardStore = create<BoardStore>((set) => ({
  columns: [],
  tasks: [],

  async loadBoard(boardId: string) {
    const columns = await api.columns.get(boardId);
    const tasks = await api.tasks.get(boardId);
    set({ columns, tasks });
  },
}));