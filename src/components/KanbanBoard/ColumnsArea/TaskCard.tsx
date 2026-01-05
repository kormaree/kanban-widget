import type { Task } from "../../../types/board";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { TaskActionsMenu } from "./TaskActionsMenu";
import calendarIcon from './images/calendar.svg';
import messageIcon from './images/message-alert-plus.svg';
import barIconGreen from './images/bar-chart-square-green.svg';
import barIconOrange from './images/bar-chart-square-orange.svg';
import barIconRed from './images/bar-chart-square-red.svg';
import dotsIcon from './images/dots3.svg';

export const TaskCard = ({ task }: { task: Task }) => {

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const lastAssignee = task.assignees?.length
    ? task.assignees[task.assignees.length - 1]
    : null;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const style = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };


  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: "relative",
        zIndex: isDragging ? 999 : "auto",
      }}
      {...attributes}
      {...listeners}
    >

      <div
        data-id={task.id}
        style={{
          fontFamily: "'Inter', sans-serif",
          backgroundColor: task.color ?? "#FFFFFF",
          borderRadius: "15px",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.06)",
          cursor: "grab",
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 400,
              color: "#000000",
              lineHeight: "28px"
            }}
          >
            {task.title}
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(true);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
            }}>
            <img 
              src={dotsIcon} 
              style={{ 
                width: "5px", 
                height: "24px"
              }} 
            />
          </button>
        </div>
        
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "16px",
                fontWeight: 500,
                padding: "6px 7px",
                borderRadius: "5px",
                backgroundColor: getPriorityColor(task.priority),
                color: getPriorityColorText(task.priority),
                display: "flex",
                alignItems: "center",
                gap: "3px"
              }}
            >
              {task.priority && (
                <img
                  src={getPriorityColorSVG(task.priority)}
                  style={{
                    width: "19px",
                    height: "19px",
                  }}
                />
              )}
              {getPriorityName(task.priority)}
            </span>

            {task.deadline && (
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  padding: "6px 7px",
                  borderRadius: "5px",
                  backgroundColor: "#C7CAFF",
                  color: "#4260AA",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px"
                }}
              >
                <img 
                src={calendarIcon} 
                style={{ 
                  width: "19px", 
                  height: "19px"
                }} 
                />
                {formatDate(task.deadline)}
              </span>
            )}

            {task.comments?.[0] && (
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  padding: "6px 7px",
                  borderRadius: "5px",
                  backgroundColor: "#D3D3D3",
                  color: "#4E5358",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px"
                }}
              >
                <img 
                src={messageIcon} 
                style={{ 
                  width: "19px", 
                  height: "19px"
                }} 
                />
                {task.comments[0].content}
              </span>
            )}
          </div>
          
          {lastAssignee && (
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#ADADAD",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                flexShrink: 0
              }}
              title={lastAssignee.name}
            >
              {getInitials(lastAssignee.name)}
            </div>
          )}
        </div>

        {isMenuOpen && (
          <TaskActionsMenu
            task={task}
            onClose={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "#FFC7C7";
    case "medium":
      return "#FFECBD";
    case "low":
      return "#CDFFC2";
  }
};

const getPriorityColorText = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "#FF2F2F";
    case "medium":
      return "#E89300";
    case "low":
      return "#30C100";
  }
};

const getPriorityName = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "высокий";
    case "medium":
      return "средний";
    case "low":
      return "низкий";
  }
};

const getPriorityColorSVG = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return barIconRed;
    case "medium":
      return barIconOrange;
    case "low":
      return barIconGreen;
  }
};

const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
  });
};

const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};