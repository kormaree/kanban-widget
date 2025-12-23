import type { Column as ColumnType } from "../../../types/column";
import filterIcon from './images/filter.svg';

export const Column = ({ column }: { column: ColumnType }) => {
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      width: "370px",
      height: "748px",
      backgroundColor: "#F4F7FC",
      borderRadius: "20px",
      padding: "25px",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <h3 style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: 600,
            color: "#000000",
          }}>
            {column.title}
          </h3>
          <span style={{
            fontSize: "22px",
            color: "#3789D5",
          }}>
            0
          </span>
        </div>
        <button style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#3789D5",
          fontSize: "44px",
        }}>
          +
        </button>
      </div>
      <button style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#8D9EAD",
          fontSize: "16px",
          fontWeight: 500,
          display: "flex",
          alignItems: "flex-start",
          padding: "0px"
        }}>
          <img 
            src={filterIcon} 
            alt="Фильтр" 
            style={{ 
              width: "20px", 
              height: "20px"
            }} 
          />
          фильтровать
      </button>

      {/* Область для карточек */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        overflowY: "auto",
        padding: "4px",
      }}>
        {/* Здесь будут карточки задач */}
        {/* Пока пустое пространство */}
      </div>
    </div>
  );
};