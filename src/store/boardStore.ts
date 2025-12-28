import { create } from "zustand";
import { getBoard } from "../api/board";
import type { Board} from "../types/board";

interface BoardStore {
  board: Board | null;
  isLoading: boolean;
  error: string | null;

  loadBoard: (boardId: string) => Promise<void>;
  clearBoard: () => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: null,
  isLoading: false,
  error: null,

  async loadBoard(boardId: string) {
    set({ isLoading: true, error: null });

    try {
      const board = await getBoard(boardId);

      set({
        board,
        isLoading: false,
      });
    } catch (error) {
      console.error("Ошибка при загрузке доски", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при загрузке доски",
        isLoading: false,
      });
    }
  },

  clearBoard() {
    set({ board: null });
  },
}));