export interface Task {
  id: string;
  title: string;
  columnId: string;
  description: string;
  priority: string;
  deadline: string;
  display_order: number;
  createdAt: string;
  updated_at: string;
  is_completed: boolean;
  created_by: string;
}