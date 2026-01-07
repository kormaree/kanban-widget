import { useRef } from "react";
import type { Column as ColumnType } from "../../../types/board";
import { Column } from "./Column";

export const ColumnsArea = ({ columns }: { columns: ColumnType[] }) => {

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

  const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const showArrows = columns.length > 4;

  return (
    <>
    <div style={{ position: "relative", height: "100%" }}>
      {showArrows && (
        <button
          onClick={() => scroll("left")}
          style={arrowStyle("left")}
        >
          ◀
        </button>
      )}
      <div ref={scrollRef} 
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: "24px",
        lineHeight: "100%",
        color: "#000000",
        display: "flex",
        padding: "30px",
        gap: "26px",
        height: "100%",
        overflowX: "auto", 
        overflowY: "hidden",
        scrollBehavior: "smooth",
        scrollbarWidth: "none", 
      }}>
        {columns.map((col) => (
          <Column key={col.id} column={col} height={"748px"} />
        ))}
      </div>
      {showArrows && (
        <button
          onClick={() => scroll("right")}
          style={arrowStyle("right")}
        >
          ▶
        </button>
      )}
    </div>
    </>
  );
};

const arrowStyle = (side: "left" | "right"): React.CSSProperties => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  [side]: "20px",
  zIndex: 20,
  width: "60px",
  height: "60px",
  borderRadius: "40%",
  border: "none",
  background: "rgba(252, 252, 252, 0.6)",
  color: "#3789D5",
  fontSize: "18px",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
});