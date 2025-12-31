export interface Board {
  id: string;
  title: string;
  background_color: string;
  members: Member[];
  columns: Column[];
}

export interface Member {
  member_id: string;
  name: string;
  role: string;
}

export interface Column {
  id: string;
  title: string;
  display_order: number;
  tasks: Task[];
}

export interface Task {
  id: string;
  board_id: string;
  title: string;
  priority: "low" | "medium" | "high";
  deadline: string;
  is_completed: boolean;
  display_order: number;
  color: string;
  assignees: Assignee[];
  subtasks: Subtask[];
  comments: Comment[];
}

export interface Assignee {
  id: string;
  name: string;
}

export interface Subtask {
  id: string;
  title: string;
  is_completed: boolean;
  display_order: number;
}

export interface Comment {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
}