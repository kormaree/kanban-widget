export type UUID = string;
export type ISODateTimeString = string;

export interface BoardStatsSummary {
  total: number;
  completed: number;
  in_progress: number;
  not_started: number;
  overdue: number;
}

export interface ProductivityPoint {
  period: ISODateTimeString;
  count: number;
}

export interface ProductivityTotals {
  total: number;
  completed: number;
  active: number;
  completed_ratio: number;
  active_ratio: number;
}

export interface BoardProductivity {
  totals: ProductivityTotals;
  series: ProductivityPoint[];
  group: "day" | "week" | "month";
  from?: ISODateTimeString;
  to?: ISODateTimeString;
}

export type TaskPriority = "low" | "medium" | "high" | "undefined";

export interface PriorityStatsItem {
  priority: TaskPriority;
  total: number;
  completed: number;
  active: number;
}

export interface BoardPriorities {
  items: PriorityStatsItem[];
}

export interface BoardWorkload {
  user_id: UUID;
  name: string;
  assigned: number;
  workload_ratio: number;
}

export interface BoardTimeByUser {
  user_id: UUID;
  name: string;
  hours: number;
}

export interface UserCompletedTasksItem {
  user_id: UUID;
  name: string;
  completed: number;
}

export interface BoardCompletedByUser {
  user_id: UUID;
  name: string;
  completed: number;
}
