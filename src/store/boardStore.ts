import { create } from "zustand";
import { getBoard } from "../api/board";
import type { Comment, Assignee, Board, Task, Column, BoardFilters } from "../types/board";
import type { BoardView } from "../types/boardView";

interface BoardStore {
  board: Board | null;
  isLoading: boolean;

  activeView: BoardView;
  setActiveView: (view: BoardView) => void;

  loadBoard: (boardId: string) => Promise<void>;
  updateColumns: (columns: Board["columns"]) => void;

  removeTask: (taskId: string) => void;
  updateTaskInStore: (taskId: string, updates: Partial<Task>) => void;
  addAssigneeToTask: (taskId: string, assignee: Assignee) => void;
  addCommentToTask: (taskId: string, comment: Comment) => void;

  addColumn: (column: Board["columns"][number]) => void;
  updateColumnInStore: (
    columnId: string,
    updates: Partial<Pick<Column, "title" | "color">>
  ) => void;

  filters: BoardFilters;
  setFilter: <K extends keyof BoardFilters>(
    key: K,
    value: BoardFilters[K]
  ) => void;
  toggleFilterValue: (
    key: "assignees" | "priorities" | "columnIds",
    value: string
  ) => void;
  resetFilters: () => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: null,
  isLoading: false,

  filters: {
    assignees: [],
    priorities: [],
    columnIds: [],
    comments: null,
    date: null,
  },

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

  removeTask(taskId) {
    set(state => {
      if (!state.board) return {};

      return {
        board: {
          ...state.board,
          columns: state.board.columns.map(col => ({
            ...col,
            tasks: col.tasks.filter(task => task.id !== taskId),
          })),
        },
      };
    });
  },

  updateTaskInStore(taskId: string, updates: Partial<Task>) {
    set(state => {
      if (!state.board) return {};

      return {
        board: {
          ...state.board,
          columns: state.board.columns.map(col => ({
            ...col,
            tasks: col.tasks.map(task =>
              task.id === taskId
                ? { ...task, ...updates }
                : task
            ),
          })),
        },
      };
    });
  },

  addAssigneeToTask(taskId, assignee) {
    set(state => {
      if (!state.board) return {};

      return {
        board: {
          ...state.board,
          columns: state.board.columns.map(col => ({
            ...col,
            tasks: col.tasks.map(task => {
              if (task.id !== taskId) return task;

              if (task.assignees.some(a => a.id === assignee.id)) {
                return task;
              }

              return {
                ...task,
                assignees: [...task.assignees, assignee],
              };
            }),
          })),
        },
      };
    });
  },

  addCommentToTask(taskId, comment) {
    set(state => {
      if (!state.board) return {};

      return {
        board: {
          ...state.board,
          columns: state.board.columns.map(col => ({
            ...col,
            tasks: col.tasks.map(task => {
              if (task.id !== taskId) return task;

              return {
                ...task,
                comments: [...task.comments, comment],
              };
            }),
          })),
        },
      };
    });
  },
  
  addColumn(column) {
    set(state => {
      if (!state.board) return {};

      return {
        board: {
          ...state.board,
          columns: [...state.board.columns, column],
        },
      };
    });
  },

  updateColumnInStore(columnId, updates) {
    set(state => {
      if (!state.board) return {};

      return {
        board: {
          ...state.board,
          columns: state.board.columns.map(col =>
            col.id === columnId ? { ...col, ...updates } : col
          ),
        },
      };
    });
  },
  
  setFilter(key, value) {
    set(state => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
  },

  toggleFilterValue(key, value) {
    set(state => {
      const list = state.filters[key];
      return {
        filters: {
          ...state.filters,
          [key]: list.includes(value)
            ? list.filter(v => v !== value)
            : [...list, value],
        },
      };
    });
  },

  resetFilters() {
    set({
      filters: {
        assignees: [],
        priorities: [],
        columnIds: [],
        comments: null,
        date: null,
      },
    });
  },
}));
