import type { Task } from "../../../types/board";

export const TaskCard = ({ task }: { task: Task }) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.06)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "#000000",
          lineHeight: "120%",
        }}
      >
        {task.title}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            padding: "4px 8px",
            borderRadius: "8px",
            backgroundColor: getPriorityColor(task.priority),
            color: "#FFFFFF",
            textTransform: "uppercase",
          }}
        >
          {task.priority}
        </span>

        {task.deadline && (
          <span
            style={{
              fontSize: "12px",
              color: "#8D9EAD",
            }}
          >
            {formatDate(task.deadline)}
          </span>
        )}
      </div>
    </div>
  );
};

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "#EB5757";
    case "medium":
      return "#F2C94C";
    case "low":
      return "#27AE60";
    default:
      return "#8D9EAD";
  }
};

const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
  });
};