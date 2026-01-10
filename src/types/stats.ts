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

export interface UserWorkloadItem {
  user_id: UUID;
  name: string;
  total_assigned: number;      // всего назначено (в периоде/всегда — зависит от параметров)
  completed_assigned: number;  // назначено и выполнено
  active_assigned: number;     // назначено и не выполнено
  overdue_assigned: number;    // назначено, не выполнено и deadline < now
  completed_ratio: number;     // completed_assigned / total_assigned (0..1)
  active_ratio: number;        // active_assigned / total_assigned (0..1)
}

export interface BoardWorkload {
  items: UserWorkloadItem[];
  from?: ISODateTimeString;
  to?: ISODateTimeString;
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
