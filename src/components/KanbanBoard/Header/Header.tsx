import { useState } from "react";
import { useBoardStore } from "../../../store/boardStore";
import type { BoardView } from "../../../types/boardView";

import addIcon from "./Icon/add-square-03.svg";
import addIconBlue from "./Icon/add-square-blue.svg";

import switchIcon from "./Icon/arrow-switch-horizontal.svg";
import switchIconBlue from "./Icon/arrow-switch-horizontal-blue.svg";

import calendarIcon from "./Icon/calendar-02.svg";
import calendarIconBlue from "./Icon/calendar-blue.svg";

import chartIcon from "./Icon/line-chart-up-02.svg";
import chartIconBlue from "./Icon/line-chart-up-blue.svg";

import pencilIcon from "./Icon/pencil-03.svg";
import pencilIconBlue from "./Icon/pencil-blue.svg";

const ICONS: {
  view: BoardView;
  icon: string;
  activeIcon: string;
  label: string;
  tooltipWidth: number;
}[] = [
  { view: "board", icon: addIcon, activeIcon: addIconBlue, label: "задачи", tooltipWidth: 64 },
  { view: "sort", icon: switchIcon, activeIcon: switchIconBlue, label: "сортировка", tooltipWidth: 106 },
  { view: "calendar", icon: calendarIcon, activeIcon: calendarIconBlue, label: "календарь", tooltipWidth: 97 },
  { view: "stats", icon: chartIcon, activeIcon: chartIconBlue, label: "статистика", tooltipWidth: 102 },
  { view: "edit", icon: pencilIcon, activeIcon: pencilIconBlue, label: "редактирование", tooltipWidth: 151 },
];

export const Header = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { activeView, setActiveView, board } = useBoardStore();

  const basePositions = [55, 107, 159, 211, 263];

  const calculatePositions = () => {
    return ICONS.map((icon, index) => {
      if (hoveredIndex === null) {
        return {
          iconLeft: basePositions[index],
          tooltipLeft: basePositions[index] + 40,
          tooltipVisible: false,
        };
      }

      if (index < hoveredIndex) {
        return {
          iconLeft: basePositions[index],
          tooltipLeft: basePositions[index] + 40,
          tooltipVisible: false,
        };
      }

      if (index === hoveredIndex) {
        return {
          iconLeft: basePositions[index],
          tooltipLeft: basePositions[index] + 40,
          tooltipVisible: true,
        };
      }

      const shift = ICONS[hoveredIndex].tooltipWidth + 10;
      return {
        iconLeft: basePositions[index] + shift,
        tooltipLeft: basePositions[index] + shift + 40,
        tooltipVisible: false,
      };
    });
  };

  const positions = calculatePositions();

  return (
    <div
      className="drag-handle"
      style={{
        width: "100%",
        height: "180px",
        background: "#FFFFFF",
        position: "relative",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: "30px",
        }}
      >
        {board?.title ?? "Загрузка доски..."}
      </div>

      {ICONS.map((icon, index) => {
        const isActive = activeView === icon.view;

        return (
          <div
            key={icon.view}
            style={{
              position: "absolute",
              left: positions[index].iconLeft,
              top: "114px",
              width: 32,
              height: 32,
              cursor: "pointer",
              transition: "left 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setActiveView(icon.view)}
          >
            <img
              src={isActive ? icon.activeIcon : icon.icon}
              alt={icon.label}
              style={{
                width: "100%",
                height: "100%",
                transform: hoveredIndex === index ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.2s ease",
              }}
            />
          </div>
        );
      })}

      {ICONS.map((icon, index) =>
        positions[index].tooltipVisible ? (
          <div
            key={`tooltip-${icon.view}`}
            style={{
              position: "absolute",
              left: positions[index].tooltipLeft,
              top: "126px",
              width: icon.tooltipWidth,
              height: 22,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 18,
              color: "#BCC1C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {icon.label}
          </div>
        ) : null
      )}
    </div>
  );
};