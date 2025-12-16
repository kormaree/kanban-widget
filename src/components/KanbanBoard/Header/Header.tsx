export const Header = () => {
  return (
    <header
      className="kanban-header drag-handle"
      style={{
        height: 32,
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        cursor: "grab",
        userSelect: "none",
        background: "#f3f4f6",
      }}
    >
      <h2 style={{ fontSize: 14 }}>Kanban Board</h2>
    </header>
  );
};