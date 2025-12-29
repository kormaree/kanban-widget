import { create } from "zustand";
import { getBoard } from "../api/board";
import type { Board } from "../types/board";

interface BoardStore {
  board: Board | null;
  isLoading: boolean;

  loadBoard: (boardId: string) => Promise<void>;
  clearBoard: () => void;

  updateColumns: (columns: Board["columns"]) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: null,
  isLoading: false,

  async loadBoard(boardId) {
    set({ isLoading: true });

    const board = await getBoard(boardId);

    set({
      board: {
        ...board,
        columns: board.columns.map(col => ({
          ...col,
          tasks: [...col.tasks].sort(
            (a, b) => a.display_order - b.display_order
          ),
        })),
      },
      isLoading: false,
    });
  },

  clearBoard() {
    set({ board: null });
  },

  updateColumns(columns) {
    set(state =>
      state.board
        ? { board: { ...state.board, columns } }
        : {}
    );
  },
}));
