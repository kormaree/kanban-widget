import { useEffect, useState, useRef } from "react";
import { createColumn, updateColumn } from "../../../api/columns";
import { useBoardStore } from "../../../store/boardStore";
import type { Column as ColumnType } from "../../../types/board";

import Paint from "./images/paint-bucket-02.svg";
import Plus from "./images/Plus.svg"

export const COLUMN_COLORS = [
  "#DCDCDC",
  "#C9F5F5",
  "#C6D6FF",
  "#EDCDF8",
  "#FFE7BB",
  "#FFD3D3",
  "#FFFAAE",
  "#C1FFAE",
];

export const Editor = ({ columns }: { columns: ColumnType[] }) => {

    const addColumn = useBoardStore(s => s.addColumn);
    const board = useBoardStore(s => s.board);

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
                  <Column key={col.id} column={col} />
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

        <button
            onClick={() => {
                if (!board) return;

                const newColumn = {
                    id: crypto.randomUUID(),
                    title: "Новая колонка",
                    color: "none",
                    display_order: board.columns.length + 1,
                    tasks: [],
                };

                addColumn(newColumn);

                createColumn({
                    title: newColumn.title,
                    color: newColumn.color,
                    display_order: newColumn.display_order,
                    board_id: board.id,
                });
            }}
            style={{
                position: "absolute",
                top: "935px",
                right: "30px",
                width: "66px",
                height: "66px",
                borderRadius: "10px",
                border: "3px dashed #3789D5",
                cursor: "pointer",
                backgroundColor: "rgba(255, 255, 255, 0)",
            }}
            >
            <img src={Plus} style={{ width: "32px", height: "32px" }} />
        </button>
        </>
    )
}

const Column = ({ column }: { column: ColumnType }) => {
  const updateColumnInStore = useBoardStore(s => s.updateColumnInStore);
  const [title, setTitle] = useState(column.title);
  const [isColorOpen, setIsColorOpen] = useState(false);

  useEffect(() => {
    const close = () => setIsColorOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    setTitle(column.title);
    }, [column.title]);

  const saveTitle = () => {
    updateColumn(column.id, {
        title,
        display_order: column.display_order,
        color: column.color,
    });
    };

  return (
    <div
      style={{
        position: "relative",
        flex: "0 0 370px",
        width: "370px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
        <div style={{
            display: "flex",
            flexDirection: "column",
            height: "675px",
            backgroundColor: "#F4F7FC",
            borderRadius: "20px",
        }}>
            <div
                style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "20px 20px 0px 20px",
                }}
            >
                <input
                value={title}
                onChange={e => {
                    const value = e.target.value;
                    setTitle(value);
                    updateColumnInStore(column.id, { title: value });
                }}
                onBlur={saveTitle}
                onKeyDown={e => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        saveTitle();
                        (e.target as HTMLInputElement).blur();
                    }
                }}
                style={{
                    fontSize: "24px",
                    marginTop: 10,
                    fontWeight: 600,
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    width: "100%",
                    borderBottom: "2px solid #E3E5EF",
                }}
                />

                <button
                style={{
                    background: "none",
                    border: "none",
                    color: "#3789D5",
                    fontSize: "44px",
                    cursor: "pointer",
                }}
                >
                +
                </button>
            </div>
            <div style={{backgroundColor: hexToRgba(column.color, 0.3), borderRadius: "20px", border: `3px solid ${column.color}`, width: "calc(100% - 4px)", height: 605}}></div>
        </div>
      <button
        onClick={e => {
          e.stopPropagation();
          setIsColorOpen(v => !v);
        }}
        style={{
          marginTop: "12px",
          alignSelf: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            color: "#3789D5",
            fontWeight: 500,
            fontSize: "16px",
          }}
        >
          добавить цвет блока
        </span>
        <img src={Paint} style={{ width: "24px", height: "24px" }} />
      </button>

      {isColorOpen && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute",
            right: "-48px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "44px",
            padding: "10px 6px",
            background: "#FFFFFF",
            borderRadius: "22px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            zIndex: 10,
          }}
        >
          {COLUMN_COLORS.map(color => (
            <button
              key={color}
              onClick={() => {
                updateColumnInStore(column.id, { color });
                setIsColorOpen(false);

                updateColumn(column.id, {
                   title: column.title,
                   color: color,
                   display_order: column.display_order,
                 });
              }}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: color,
                border:
                  column.color === color
                    ? "2px solid #8AC1F4"
                    : "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const hexToRgba = (hex: string, alpha: number) => {
  if (hex === "none" || hex === null) return "none";
  
  const cleaned = hex.replace("#", "");

  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
  background: "rgba(55, 137, 213, 0.5)",
  color: "#fff",
  fontSize: "18px",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
});