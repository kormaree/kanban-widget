import type { Column, Task } from "../types/board";
import { useBoardStore } from "./boardStore";

export const useBoardColumns = (): Column[] =>
  useBoardStore((state) => state.board?.columns ?? []);

export const useBoardTasks = (): Task[] =>
  useBoardStore((state) =>
    state.board?.columns.flatMap((column) => column.tasks) ?? []
  );

export const useBoard = () =>
  useBoardStore((state) => state.board);

export const useBoardLoading = () =>
  useBoardStore((state) => state.isLoading);

export const useBoardError = () =>
  useBoardStore((state) => state.error);
