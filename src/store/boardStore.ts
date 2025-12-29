import { create } from "zustand";
import { getBoard } from "../api/board";
import type { Board } from "../types/board";
import type { BoardView } from "../types/boardView";

interface BoardStore {
  board: Board | null;
  isLoading: boolean;

  activeView: BoardView;
  setActiveView: (view: BoardView) => void;

  loadBoard: (boardId: string) => Promise<void>;
  updateColumns: (columns: Board["columns"]) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: null,
  isLoading: false,

  activeView: "board",

  setActiveView(view) {
    set({ activeView: view });
  },

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

  updateColumns(columns) {
    set(state =>
      state.board
        ? { board: { ...state.board, columns } }
        : {}
    );
  },
}));
