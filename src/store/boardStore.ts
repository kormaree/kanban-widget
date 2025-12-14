import { create } from "zustand";
import { getColumns } from "../api/columns";
import { getTasks } from "../api/tasks";
import type { Column } from "../types/column";
import type { Task } from "../types/task";

interface BoardStore {
  columns: Column[];
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  loadBoard: (boardId: string) => Promise<void>;
  clearBoard: () => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  columns: [],
  tasks: [],
  isLoading: false,
  error: null,

  async loadBoard(boardId: string) {
    set({ isLoading: true, error: null });
    
    try {
      const [columns, tasks] = await Promise.all([
        getColumns(boardId),
        getTasks(boardId)
      ]);
      
      set({ 
        columns, 
        tasks,
        isLoading: false 
      });
    } catch (error) {
      console.error("Ошибка при загрузке доски", error);
      set({ 
        error: error instanceof Error ? error.message : "Ошибка при загрузке доски",
        isLoading: false 
      });
    }
  },

  clearBoard() {
    set({ columns: [], tasks: [] });
  },
}));